import { create } from 'zustand';
import type { AppSnapshot, DispatchInput, ReceiptInput, Result, ScenarioId, SplitInput } from '../domain/types.ts';
import { dispatch as dispatchCommand, receive as receiveCommand, split as splitCommand } from '../domain/commands.ts';
import { preloadedSnapshot, emptySnapshot } from '../mocks/seedData.ts';
import { readSnapshot, writeSnapshot } from '../storage/repository.ts';
import { useSyncStore } from './useSyncStore.ts';
import { useSessionStore } from './useSessionStore.ts';
import { confirmSync } from '../domain/sync.ts';
import { availableLots } from '../domain/selectors.ts';

type StoreState = {
  snapshot: AppSnapshot;
  isHydrated: boolean;
  storageError: string | null;
  notice: { message: string; tone: 'success' | 'warning' } | null;
  hydrate: () => Promise<void>;
  receive: (input: ReceiptInput) => Promise<Result<string>>;
  split: (input: SplitInput) => Promise<Result<string[]>>;
  dispatch: (input: DispatchInput) => Promise<Result<string>>;
  markSynced: (operationIds: string[]) => Promise<void>;
  resetDemo: (mode: 'preloaded' | 'empty', scenarioId?: ScenarioId) => Promise<void>;
  clearStorageError: () => void;
  clearNotice: () => void;
};

let writeQueue: Promise<unknown> = Promise.resolve();

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(operation, operation);
  writeQueue = next.catch(() => undefined);
  return next;
}

function failure<T>(code: string, message: string): Result<T> {
  return { ok: false, code, message };
}

export const useAppStore = create<StoreState>((set, get) => {
  async function run<T>(command: (snapshot: AppSnapshot, isOnline: boolean) => Result<{ snapshot: AppSnapshot; value: T }>, onlineMessage: string, offlineMessage: string): Promise<Result<T>> {
    return serialize(async () => {
      const { snapshot } = get();
      const isOnline = useSyncStore.getState().isOnline;
      const result = command(snapshot, isOnline);
      if (!result.ok) return result;
      try {
        await writeSnapshot(result.value.snapshot);
        set({ snapshot: result.value.snapshot, storageError: null, notice: { message: isOnline ? onlineMessage : offlineMessage, tone: isOnline ? 'success' : 'warning' } });
        return { ok: true, value: result.value.value };
      } catch {
        const message = 'No se pudo guardar en este dispositivo. Revisa el almacenamiento e inténtalo de nuevo.';
        set({ storageError: message });
        return failure('STORAGE_FAILED', message);
      }
    });
  }

  return {
    snapshot: emptySnapshot(),
    isHydrated: false,
    storageError: null,
    notice: null,
    hydrate: async () => {
      try {
        const saved = await readSnapshot();
        if (saved) {
          set({ snapshot: saved, isHydrated: true, storageError: null });
          return;
        }
        const initial = preloadedSnapshot();
        await writeSnapshot(initial);
        set({ snapshot: initial, isHydrated: true, storageError: null });
      } catch (error) {
        set({ isHydrated: true, storageError: error instanceof Error ? error.message : 'No se pudieron leer los datos.' });
      }
    },
    receive: (input) => run((snapshot, online) => receiveCommand(snapshot, input, useSessionStore.getState().companyId, online), 'Recepción guardada en inventario.', 'Guardado en este dispositivo. La recepción queda pendiente de sincronización.'),
    split: (input) => run((snapshot, online) => splitCommand(snapshot, input, useSessionStore.getState().companyId, online), 'Desposte registrado en inventario.', 'Guardado en este dispositivo. El desposte queda pendiente de sincronización.'),
    dispatch: (input) => run((snapshot, online) => dispatchCommand(snapshot, input, useSessionStore.getState().companyId, online), 'Despacho registrado. El inventario ya está actualizado.', 'Guardado en este dispositivo. El despacho queda pendiente de sincronización.'),
    markSynced: async (operationIds) => serialize(async () => {
      const current = get().snapshot;
      const updated = confirmSync(current, operationIds);
      try {
        await writeSnapshot(updated);
        set({ snapshot: updated, storageError: null });
      } catch {
        set({ storageError: 'No se pudo guardar la confirmación simulada. Los movimientos siguen pendientes.' });
        throw new Error('No se pudo guardar la confirmación simulada.');
      }
    }),
    resetDemo: async (mode) => serialize(async () => {
      const next = mode === 'preloaded' ? preloadedSnapshot() : emptySnapshot();
      await writeSnapshot(next);
      useSyncStore.setState({ isOnline: true, isSyncing: false });
      set({ snapshot: next, storageError: null });
    }),
    clearStorageError: () => set({ storageError: null }),
    clearNotice: () => set({ notice: null }),
  };
});

export const selectAvailableLots = (snapshot: AppSnapshot, companyId: AppSnapshot['lots'][number]['companyId']) =>
  availableLots(snapshot, companyId);

export const selectPendingCount = (snapshot: AppSnapshot) => snapshot.pendingOperationIds.length;
