import { useMemo, useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { LotCard } from '../../src/components/inventory/LotCard.tsx';
import { EmptyState, PageTitle, Panel } from '../../src/components/ui/Primitives.tsx';
import { productById } from '../../src/mocks/catalog.ts';
import { selectAvailableLots, useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';

type Filter = 'all' | 'raw' | 'sale';

export default function InventoryScreen() {
  const companyId = useSessionStore((state) => state.companyId);
  const snapshot = useAppStore((state) => state.snapshot);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const lots = useMemo(() => selectAvailableLots(snapshot, companyId).filter((lot) => {
    const product = productById(lot.productId);
    const matchesFilter = filter === 'all' || (filter === 'raw' ? product?.kind === 'raw' : product?.kind !== 'raw');
    return matchesFilter && (product?.name.toLowerCase().includes(search.trim().toLowerCase()) ?? false);
  }), [snapshot, companyId, filter, search]);
  const filters: { id: Filter; title: string }[] = [{ id: 'all', title: 'Todo' }, { id: 'raw', title: 'Materia prima' }, { id: 'sale', title: 'Para venta' }];
  return (
    <AppShell>
      <PageTitle title="Inventario" subtitle="Existencias disponibles de la empresa activa." />
      <Panel>
        <Text className="mb-2 text-sm font-bold uppercase text-muted">Buscar producto</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Ej. Costillas" className="min-h-12 rounded-xl border border-line bg-white px-4 text-base text-ink" />
      </Panel>
      <View className="flex-row gap-2">
        {filters.map((item) => <Text key={item.id} onPress={() => setFilter(item.id)} accessibilityRole="button" className={`rounded-full border px-4 py-3 text-sm font-bold ${filter === item.id ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink'}`}>{item.title}</Text>)}
      </View>
      <View className="flex-row items-center justify-between px-1">
        <Text className="text-sm font-semibold text-muted">{lots.length} lote{lots.length === 1 ? '' : 's'} disponible{lots.length === 1 ? '' : 's'}</Text>
        <Text className="text-sm font-semibold text-muted">Almacén Meet Company</Text>
      </View>
      {lots.length ? <View className="gap-3">{lots.map((lot) => <LotCard key={lot.id} lot={lot} href={`/lotes/${lot.id}`} badge={productById(lot.productId)?.kind === 'raw' ? 'Materia prima' : 'Despachable'} />)}</View> : <EmptyState title={search ? 'No hay coincidencias' : 'Inventario vacío'} detail={search ? 'Prueba otro nombre de producto.' : 'Registra una compra para agregar existencias.'} />}
    </AppShell>
  );
}
