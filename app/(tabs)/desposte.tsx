import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { LotCard } from '../../src/components/inventory/LotCard.tsx';
import { EmptyState, PageTitle } from '../../src/components/ui/Primitives.tsx';
import { productById } from '../../src/mocks/catalog.ts';
import { selectAvailableLots, useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';

export default function CuttingQueueScreen() {
  const companyId = useSessionStore((state) => state.companyId);
  const snapshot = useAppStore((state) => state.snapshot);
  const lots = selectAvailableLots(snapshot, companyId).filter((lot) => productById(lot.productId)?.kind === 'raw');
  return (
    <AppShell>
      <PageTitle title="Desposte" subtitle="Selecciona una materia prima para distribuir su peso en cortes y merma." />
      <View className="rounded-xl border border-line bg-white p-4">
        <Text className="text-sm font-bold uppercase tracking-wide text-muted">Regla de cierre</Text>
        <Text className="mt-2 text-base leading-6 text-ink">Cortes + merma deben sumar exactamente el peso disponible del lote.</Text>
      </View>
      {lots.length ? <View className="gap-3">{lots.map((lot) => <LotCard key={lot.id} lot={lot} href={`/produccion/${lot.id}`} badge="Pendiente de desposte" />)}</View> : (
        <EmptyState title="Sin lotes por despostar" detail="Registra una materia prima para que aparezca aquí." action={<Link href="/(tabs)/recepcion" className="min-h-12 rounded-xl bg-brand px-4 py-3 text-center font-bold text-white">Ir a recepción</Link>} />
      )}
    </AppShell>
  );
}
