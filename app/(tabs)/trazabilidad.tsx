import { useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, Text, TextInput } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { EmptyState, PageTitle } from '../../src/components/ui/Primitives.tsx';
import { useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';
import { companyName, productById } from '../../src/mocks/catalog.ts';
import { gramsToKg } from '../../src/domain/weights.ts';

export default function TraceabilityScreen() {
  const [search, setSearch] = useState('');
  const snapshot = useAppStore((state) => state.snapshot);
  const owner = useSessionStore((state) => state.companyId);
  const query = search.trim().toLocaleLowerCase('es');
  const lots = snapshot.lots.filter((lot) => lot.companyId === owner && `${lot.id} ${productById(lot.productId)?.name ?? ''}`.toLocaleLowerCase('es').includes(query)).slice().reverse();
  return (
    <AppShell>
      <PageTitle title="Trazabilidad" subtitle={`Historia de los lotes de ${companyName(owner)}, disponibles y agotados. Abre un lote para consultar sus movimientos y su origen.`} />
      <TextInput accessibilityLabel="Buscar lote por código o producto" placeholder="Código de lote o producto" value={search} onChangeText={setSearch} className="min-h-14 rounded-xl border border-line bg-white px-4 text-base text-ink" />
      {lots.map((lot) => (
        <Link key={lot.id} href={`/lotes/${lot.id}` as never} asChild>
          <Pressable accessibilityRole="button" className="rounded-2xl border border-line bg-white p-4 active:opacity-80">
            <Text className="text-lg font-bold text-ink">{productById(lot.productId)?.name ?? lot.productId}</Text>
            <Text className="mt-1 text-xs text-muted" selectable>{lot.id}</Text>
            <Text className="mt-3 text-base font-semibold text-brand">{lot.status === 'available' ? `${gramsToKg(lot.availableGrams)} kg disponibles` : 'Agotado / procesado'}</Text>
            <Text className="mt-1 text-sm text-muted">{snapshot.movements.filter((movement) => movement.companyId === owner && movement.lotIds.includes(lot.id)).length} movimientos registrados</Text>
          </Pressable>
        </Link>
      ))}
      {!lots.length ? <EmptyState title="Sin lotes para mostrar" detail="Revisa el propietario o la búsqueda. Las recepciones guardadas aparecen aquí, incluso después de procesarlas o despacharlas." /> : null}
    </AppShell>
  );
}
