import { Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell } from '../src/components/layout/AppShell.tsx';
import { ActionButton, InfoBanner, PageTitle, Panel } from '../src/components/ui/Primitives.tsx';
import { selectAvailableLots, selectPendingCount, useAppStore } from '../src/store/useAppStore.ts';
import { useSessionStore } from '../src/store/useSessionStore.ts';
import { useSyncStore } from '../src/store/useSyncStore.ts';
import { productById } from '../src/mocks/catalog.ts';
import { gramsToKg } from '../src/domain/weights.ts';

export default function DemoControlsScreen() {
  const snapshot = useAppStore((state) => state.snapshot);
  const resetDemo = useAppStore((state) => state.resetDemo);
  const clearError = useAppStore((state) => state.clearStorageError);
  const storageError = useAppStore((state) => state.storageError);
  const companyId = useSessionStore((state) => state.companyId);
  const logout = useSessionStore((state) => state.logout);
  const pending = selectPendingCount(snapshot);
  const sync = useSyncStore();
  const availableLots = selectAvailableLots(snapshot, companyId);
  const availableGrams = availableLots.reduce((sum, lot) => sum + lot.availableGrams, 0);
  const confirmReset = (mode: 'preloaded' | 'empty') => Alert.alert(
    'Reiniciar demostración',
    mode === 'preloaded' ? 'Restaurar las tres recepciones iniciales. Se borrarán movimientos actuales.' : 'Vaciar inventario para empezar desde recepción. Se borrarán movimientos actuales.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Reiniciar', style: 'destructive', onPress: () => { void resetDemo(mode).then(() => { clearError(); router.replace('/(tabs)/inicio'); }); } },
    ],
  );
  return (
    <AppShell>
      <PageTitle title="Controles de demo" subtitle="Ajusta el punto de partida y muestra el comportamiento sin conexión." />
      {storageError ? <InfoBanner text={storageError} tone="error" /> : null}
      <Panel className="gap-3">
        <Text className="text-lg font-bold text-ink">Estado actual</Text>
        <View className="flex-row justify-between"><Text className="text-muted">Lotes disponibles</Text><Text className="font-bold text-ink">{availableLots.length}</Text></View>
        <View className="flex-row justify-between"><Text className="text-muted">Peso disponible · empresa activa</Text><Text className="font-bold text-ink">{gramsToKg(availableGrams)} kg</Text></View>
        <View className="flex-row justify-between"><Text className="text-muted">Movimientos pendientes</Text><Text className="font-bold text-ink">{pending}</Text></View>
        <View className="flex-row justify-between"><Text className="text-muted">Señal simulada</Text><Text className={`font-bold ${sync.isOnline ? 'text-success' : 'text-warning'}`}>{sync.isOnline ? 'Con conexión' : 'Sin conexión'}</Text></View>
      </Panel>
      <Panel className="gap-3">
        <Text className="text-lg font-bold text-ink">Preparar el recorrido</Text>
        <Text className="text-base leading-6 text-muted">El punto precargado incluye las tres recepciones; el punto vacío permite hacerlas durante la demo.</Text>
        <ActionButton label="Restaurar casos precargados" onPress={() => confirmReset('preloaded')} />
        <ActionButton label="Empezar con inventario vacío" tone="outline" onPress={() => confirmReset('empty')} />
      </Panel>
      <Panel className="gap-3">
        <Text className="text-lg font-bold text-ink">Inventario de la empresa activa</Text>
        {availableLots.map((lot) => <View key={lot.id} className="flex-row justify-between border-t border-line py-2"><Text className="flex-1 text-ink">{productById(lot.productId)?.name}</Text><Text className="font-bold text-ink">{gramsToKg(lot.availableGrams)} kg</Text></View>)}
      </Panel>
      <ActionButton label="Bloquear con PIN" tone="outline" onPress={() => { logout(); router.replace('/(auth)/unlock'); }} />
    </AppShell>
  );
}
