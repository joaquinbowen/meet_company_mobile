import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import type { Lot } from '../../domain/types.ts';
import { gramsToKg } from '../../domain/weights.ts';
import { companyName, productById } from '../../mocks/catalog.ts';

export function LotCard({ lot, href, badge }: { lot: Lot; href: string; badge?: string }) {
  const product = productById(lot.productId);
  return (
    <Link href={href as never} asChild>
      <Pressable accessibilityRole="button" className="rounded-2xl border border-line bg-white p-4 active:opacity-80">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-ink">{product?.name ?? 'Producto'}</Text>
            <Text className="mt-1 text-sm font-semibold text-muted">Propietario: {companyName(lot.companyId)}</Text>
            <Text className="mt-1 text-sm text-muted">Lote {lot.id.slice(-10)}{badge ? ` · ${badge}` : ''}</Text>
          </View>
          <Text className="text-2xl font-extrabold tabular-nums text-brand">{gramsToKg(lot.availableGrams)} kg</Text>
        </View>
        <View className="mt-3 h-1.5 rounded-full bg-canvas">
          <View className="h-1.5 rounded-full bg-brand" style={{ width: `${Math.max(4, Math.min(100, lot.availableGrams / lot.initialGrams * 100))}%` }} />
        </View>
      </Pressable>
    </Link>
  );
}
