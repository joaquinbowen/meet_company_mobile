import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { ActionButton, InfoBanner, PageTitle, Panel } from '../../src/components/ui/Primitives.tsx';
import { gramsToKg } from '../../src/domain/weights.ts';
import { companyName, productById } from '../../src/mocks/catalog.ts';
import { useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';

export default function LotDetailsScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const companyId = useSessionStore((state) => state.companyId);
  const snapshot = useAppStore((state) => state.snapshot);
  const lot = snapshot.lots.find((item) => item.id === lotId && item.companyId === companyId);
  if (!lot) return <AppShell><InfoBanner text="Lote no disponible para la empresa activa." tone="error" /><Link href="/(tabs)/inventario" className="rounded-xl bg-brand p-4 text-center font-bold text-white">Volver al inventario</Link></AppShell>;
  const product = productById(lot.productId);
  const movements = snapshot.movements.filter((movement) => movement.lotIds.includes(lot.id) && movement.companyId === companyId).slice().reverse();
  return (
    <AppShell>
      <PageTitle title={product?.name ?? 'Lote'} subtitle={`Propietario: ${companyName(lot.companyId)} · Almacén: Meet Company`} />
      <Panel className="gap-4">
        <View className="flex-row items-end justify-between">
          <View><Text className="text-sm font-bold uppercase text-muted">Disponible</Text><Text className="mt-1 text-4xl font-extrabold tabular-nums text-brand">{gramsToKg(lot.availableGrams)} kg</Text></View>
          <Text className={`mb-1 rounded-full px-3 py-2 text-sm font-bold ${lot.status === 'available' ? 'bg-emerald-50 text-success' : 'bg-stone-100 text-muted'}`}>{lot.status === 'available' ? 'Disponible' : 'Agotado'}</Text>
        </View>
        <View className="flex-row justify-between border-t border-line pt-3"><Text className="text-sm text-muted">Peso de entrada</Text><Text className="font-bold text-ink">{gramsToKg(lot.initialGrams)} kg</Text></View>
        {lot.parentLotId ? <Link href={`/lotes/${lot.parentLotId}` as never} className="min-h-12 rounded-xl border border-line p-3 font-bold text-brand">Ver lote de origen · {lot.parentLotId.slice(-10)}</Link> : null}
        {snapshot.lots.filter((child) => child.parentLotId === lot.id && child.companyId === companyId).map((child) => <Link key={child.id} href={`/lotes/${child.id}` as never} className="min-h-12 rounded-xl border border-line p-3 font-bold text-brand">Ver corte · {productById(child.productId)?.name ?? child.productId}</Link>)}
        {lot.status === 'available' && product?.kind === 'raw' ? <ActionButton label="Enviar a desposte" onPress={() => router.push(`/produccion/${lot.id}` as never)} /> : null}
        {lot.status === 'available' && product?.kind !== 'raw' ? <ActionButton label="Registrar despacho" onPress={() => router.push(`/despacho/${lot.id}` as never)} /> : null}
      </Panel>
      <Panel>
        <Text className="mb-3 text-lg font-bold text-ink">Movimientos del lote</Text>
        {movements.length ? movements.map((movement) => <View key={movement.id} className="flex-row items-center justify-between border-t border-line py-3"><View><Text className="font-semibold capitalize text-ink">{movement.type === 'receipt' ? 'Recepción' : movement.type === 'split' ? 'Desposte' : 'Despacho'}</Text><Text className="mt-1 text-xs text-muted">{new Date(movement.createdAt).toLocaleString('es')}</Text>{movement.wasteGrams !== undefined ? <Text className="mt-1 text-sm text-warning">Merma: {gramsToKg(movement.wasteGrams)} kg</Text> : null}{movement.customerLabel ? <Text className="mt-1 text-sm text-muted">Cliente: {movement.customerLabel}</Text> : null}</View><Text className="font-bold tabular-nums text-ink">{gramsToKg(movement.grams)} kg</Text></View>) : <Text className="text-base text-muted">Sin movimientos.</Text>}
      </Panel>
      <Link href="/(tabs)/trazabilidad" className="rounded-xl border border-line bg-white p-4 text-center font-bold text-ink">Ver todos los lotes en Trazabilidad</Link>
      <Link href="/(tabs)/inventario" className="rounded-xl border border-line bg-white p-4 text-center font-bold text-ink">Volver al inventario</Link>
    </AppShell>
  );
}
