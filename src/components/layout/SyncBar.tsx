import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { selectPendingCount, useAppStore } from '../../store/useAppStore.ts';
import { useSyncStore } from '../../store/useSyncStore.ts';

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
let syncRunActive = false;

async function processPending() {
  if (syncRunActive) return;
  syncRunActive = true;
  useSyncStore.getState().setSyncing(true);
  try {
    while (useSyncStore.getState().isOnline) {
      const ids = useAppStore.getState().snapshot.pendingOperationIds.slice();
      if (!ids.length) break;
      await pause(550 * ids.length);
      if (!useSyncStore.getState().isOnline) break;
      await useAppStore.getState().markSynced(ids);
    }
  } catch {
    // Keep failed movements pending; storageError reports the reason.
  } finally {
    syncRunActive = false;
    useSyncStore.getState().setSyncing(false);
    if (useSyncStore.getState().isOnline && !useAppStore.getState().storageError && useAppStore.getState().snapshot.pendingOperationIds.length) void processPending();
  }
}

export function SyncBar() {
  const pendingCount = useAppStore((state) => selectPendingCount(state.snapshot));
  const online = useSyncStore((state) => state.isOnline);
  const syncing = useSyncStore((state) => state.isSyncing);
  const setOnline = useSyncStore((state) => state.setOnline);

  useEffect(() => {
    if (online && pendingCount > 0) void processPending();
  }, [online, pendingCount]);

  const dotColor = !online ? 'bg-rose-500' : pendingCount ? 'bg-amber-400' : 'bg-emerald-400';
  const label = !online
    ? `Sin conexión${pendingCount > 0 ? ` (${pendingCount})` : ''} · Reconectar`
    : syncing
    ? 'Sincronizando…'
    : pendingCount
    ? `${pendingCount} pendiente${pendingCount === 1 ? '' : 's'} · Sincronizar`
    : 'Online · Simular corte';

  return (
    <View className="mt-2 flex-row items-center justify-between border-t border-white/10 pt-2">
      <Pressable
        accessibilityRole="button"
        onPress={() => setOnline(!online)}
        className="flex-row items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 active:bg-white/20"
      >
        <View className={`h-2 w-2 rounded-full ${dotColor}`} />
        <Text className="text-xs font-semibold text-stone-200">{label}</Text>
      </Pressable>

      <Link href="/demo" asChild>
        <Pressable accessibilityRole="button" className="px-2 py-1">
          <Text className="text-xs font-bold text-stone-400 active:text-stone-200">⚙ Controles demo</Text>
        </Pressable>
      </Link>
    </View>
  );
}

