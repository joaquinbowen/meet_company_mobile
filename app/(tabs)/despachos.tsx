import { View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { LotCard } from '../../src/components/inventory/LotCard.tsx';
import { EmptyState, PageTitle } from '../../src/components/ui/Primitives.tsx';
import { selectAvailableLots, useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';
import { companyName, productById } from '../../src/mocks/catalog.ts';

export default function DispatchQueueScreen() {
  const companyId = useSessionStore((state) => state.companyId);
  const snapshot = useAppStore((state) => state.snapshot);
  const lots = selectAvailableLots(snapshot, companyId).filter((lot) => {
    const kind = productById(lot.productId)?.kind;
    return kind === 'cut' || kind === 'finished';
  });
  return (
    <AppShell>
      <PageTitle title="Despachos" subtitle={`Productos de ${companyName(companyId)} listos para salir de Meet Company. Selecciona un lote para registrar cliente y kilos.`} />
      {lots.length ? <View className="gap-3">{lots.map((lot) => <LotCard key={lot.id} lot={lot} href={`/despacho/${lot.id}`} badge="Disponible para despacho" />)}</View> : <EmptyState title="Sin productos listos para despachar" detail="Procesa la materia prima en Producción o registra un producto terminado en Recepción. Revisa también el propietario seleccionado." />}
    </AppShell>
  );
}
