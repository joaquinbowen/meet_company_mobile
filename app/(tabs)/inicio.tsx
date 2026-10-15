import { useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';
import { companyName, productById } from '../../src/mocks/catalog.ts';
import { gramsToKg } from '../../src/domain/weights.ts';
import {
  ReceptionIcon,
  CutIcon,
  InventoryIcon,
  DispatchIcon,
  TraceabilityIcon,
  GuideIcon,
} from '../../src/components/ui/Icons.tsx';

export default function HomeScreen() {
  const [showGuide, setShowGuide] = useState(false);
  const snapshot = useAppStore((state) => state.snapshot);
  const owner = useSessionStore((state) => state.companyId);

  const available = snapshot.lots.filter((lot) => lot.status === 'available' && lot.availableGrams > 0);
  const owned = available.filter((lot) => lot.companyId === owner);
  const rawCount = owned.filter((lot) => productById(lot.productId)?.kind === 'raw').length;
  const saleCount = owned.length - rawCount;
  const plantTotalGrams = available.reduce((sum, lot) => sum + lot.availableGrams, 0);
  const ownerTotalGrams = owned.reduce((sum, lot) => sum + lot.availableGrams, 0);

  return (
    <AppShell>
      {/* Resumen rápido de stock de planta */}
      <View className="flex-row items-center justify-between rounded-2xl border border-line bg-white p-3.5 shadow-sm">
        <View className="flex-1 border-r border-line pr-3">
          <Text className="text-[11px] font-bold uppercase tracking-wider text-muted">Stock en Planta</Text>
          <Text className="mt-0.5 text-xl font-black tabular-nums text-ink">{gramsToKg(plantTotalGrams)} kg</Text>
          <Text className="text-[11px] text-muted">Total cámaras frío</Text>
        </View>
        <View className="flex-1 pl-3">
          <Text className="text-[11px] font-bold uppercase tracking-wider text-brand">{companyName(owner)}</Text>
          <Text className="mt-0.5 text-xl font-black tabular-nums text-brand">{gramsToKg(ownerTotalGrams)} kg</Text>
          <Text className="text-[11px] text-muted">{owned.length} lotes disponibles</Text>
        </View>
      </View>

      {/* Título de sección operativa */}
      <View className="pt-1">
        <Text className="text-xs font-bold uppercase tracking-wider text-muted">Módulos de Planta</Text>
        <Text className="text-lg font-black tracking-tight text-ink">
          Operando con mercadería de {companyName(owner)}
        </Text>
      </View>

      {/* Cuadrícula operativa en 2 columnas (2 x 2) */}
      <View className="gap-3">
        {/* Fila 1: Recepción y Desposte */}
        <View className="flex-row gap-3">
          {/* Módulo 1: Recepción */}
          <Link href="/(tabs)/recepcion" asChild className="flex-1">
            <Pressable
              accessibilityRole="button"
              className="min-h-[148px] flex-1 justify-between rounded-2xl border-2 border-amber-200 bg-white p-3.5 shadow-sm active:bg-amber-50"
            >
              <View className="flex-row items-center justify-between">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                  <ReceptionIcon size={22} color="#B45309" />
                </View>
                <View className="rounded-md bg-amber-100 px-2 py-0.5">
                  <Text className="text-[10px] font-black uppercase tracking-wider text-amber-800">Paso 1</Text>
                </View>
              </View>
              <View className="mt-2.5">
                <Text className="text-xl font-black leading-tight text-ink">Recepción</Text>
                <Text className="mt-0.5 text-xs text-muted">Ingreso camión</Text>
              </View>
              <View className="mt-2 self-start rounded-full bg-amber-50 px-2 py-0.5 border border-amber-200">
                <Text className="text-[11px] font-bold text-amber-800">+ Registrar compra</Text>
              </View>
            </Pressable>
          </Link>

          {/* Módulo 2: Desposte */}
          <Link href="/(tabs)/desposte" asChild className="flex-1">
            <Pressable
              accessibilityRole="button"
              className="min-h-[148px] flex-1 justify-between rounded-2xl border-2 border-rose-200 bg-white p-3.5 shadow-sm active:bg-rose-50"
            >
              <View className="flex-row items-center justify-between">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                  <CutIcon size={22} color="#BE123C" />
                </View>
                <View className="rounded-md bg-rose-100 px-2 py-0.5">
                  <Text className="text-[10px] font-black uppercase tracking-wider text-rose-800">Paso 2</Text>
                </View>
              </View>
              <View className="mt-2.5">
                <Text className="text-xl font-black leading-tight text-ink">Desposte</Text>
                <Text className="mt-0.5 text-xs text-muted">Mesa de corte</Text>
              </View>
              <View className={`mt-2 self-start rounded-full px-2 py-0.5 border ${rawCount > 0 ? 'bg-rose-50 border-rose-300' : 'bg-stone-50 border-stone-200'}`}>
                <Text className={`text-[11px] font-bold ${rawCount > 0 ? 'text-rose-700 font-extrabold' : 'text-muted'}`}>
                  {rawCount > 0 ? `${rawCount} por cortar` : 'Al día'}
                </Text>
              </View>
            </Pressable>
          </Link>
        </View>

        {/* Fila 2: Inventario y Despachos */}
        <View className="flex-row gap-3">
          {/* Módulo 3: Inventario */}
          <Link href="/(tabs)/inventario" asChild className="flex-1">
            <Pressable
              accessibilityRole="button"
              className="min-h-[148px] flex-1 justify-between rounded-2xl border-2 border-sky-200 bg-white p-3.5 shadow-sm active:bg-sky-50"
            >
              <View className="flex-row items-center justify-between">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                  <InventoryIcon size={22} color="#0369A1" />
                </View>
                <View className="rounded-md bg-sky-100 px-2 py-0.5">
                  <Text className="text-[10px] font-black uppercase tracking-wider text-sky-800">Stock</Text>
                </View>
              </View>
              <View className="mt-2.5">
                <Text className="text-xl font-black leading-tight text-ink">Inventario</Text>
                <Text className="mt-0.5 text-xs text-muted">Cámara de frío</Text>
              </View>
              <View className="mt-2 self-start rounded-full bg-sky-50 px-2 py-0.5 border border-sky-200">
                <Text className="text-[11px] font-bold text-sky-800">{owned.length} lotes activos</Text>
              </View>
            </Pressable>
          </Link>

          {/* Módulo 4: Despachos */}
          <Link href="/(tabs)/despachos" asChild className="flex-1">
            <Pressable
              accessibilityRole="button"
              className="min-h-[148px] flex-1 justify-between rounded-2xl border-2 border-emerald-200 bg-white p-3.5 shadow-sm active:bg-emerald-50"
            >
              <View className="flex-row items-center justify-between">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
                  <DispatchIcon size={22} color="#047857" />
                </View>
                <View className="rounded-md bg-emerald-100 px-2 py-0.5">
                  <Text className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Paso 3</Text>
                </View>
              </View>
              <View className="mt-2.5">
                <Text className="text-xl font-black leading-tight text-ink">Despachos</Text>
                <Text className="mt-0.5 text-xs text-muted">Salida / Entrega</Text>
              </View>
              <View className={`mt-2 self-start rounded-full px-2 py-0.5 border ${saleCount > 0 ? 'bg-emerald-50 border-emerald-300' : 'bg-stone-50 border-stone-200'}`}>
                <Text className={`text-[11px] font-bold ${saleCount > 0 ? 'text-emerald-700 font-extrabold' : 'text-muted'}`}>
                  {saleCount > 0 ? `${saleCount} listos` : 'Sin stock'}
                </Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Módulo 5: Trazabilidad (Ancho completo) */}
      <Link href="/(tabs)/trazabilidad" asChild>
        <Pressable
          accessibilityRole="button"
          className="flex-row items-center justify-between rounded-2xl border-2 border-purple-200 bg-white p-4 shadow-sm active:bg-purple-50"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <TraceabilityIcon size={24} color="#6B21A8" />
            </View>
            <View>
              <View className="flex-row items-center gap-2">
                <Text className="text-lg font-black text-ink">Trazabilidad</Text>
                <View className="rounded bg-purple-100 px-1.5 py-0.5">
                  <Text className="text-[10px] font-black uppercase tracking-wider text-purple-800">Historial</Text>
                </View>
              </View>
              <Text className="text-xs text-muted">Rastreo de origen, mermas y lotes agotados</Text>
            </View>
          </View>
          <Text className="text-xl font-bold text-purple-700">›</Text>
        </Pressable>
      </Link>

      {/* Guía didáctica colapsable (Para no saturar la pantalla del operario) */}
      <View className="rounded-2xl border border-line bg-white overflow-hidden shadow-sm">
        <Pressable
          accessibilityRole="button"
          onPress={() => setShowGuide(!showGuide)}
          className="flex-row items-center justify-between p-4 active:bg-canvas"
        >
          <View className="flex-row items-center gap-2.5">
            <GuideIcon size={18} color="#746F6A" />
            <Text className="text-sm font-bold text-ink">Guía de los 3 casos de demostración</Text>
          </View>
          <Text className="text-sm font-bold text-brand">{showGuide ? 'Ocultar ▲' : 'Ver detalle ▼'}</Text>
        </Pressable>

        {showGuide ? (
          <View className="border-t border-line bg-canvas/50 p-4 gap-3">
            <View className="gap-1">
              <Text className="text-xs font-black uppercase tracking-wider text-amber-700">Caso 1 · Rodrigo</Text>
              <Text className="text-xs leading-5 text-ink">
                Compra 400 kg de Res Entera ($1,200). En Desposte se reparten en Lomo Fino (100kg), Churrasco (150kg), Guiso (100kg) y merma (50kg). Rendimiento útil: 87.5%. Al despachar 30 kg de Lomo Fino, quedan 70 kg.
              </Text>
            </View>
            <View className="gap-1 border-t border-line pt-2">
              <Text className="text-xs font-black uppercase tracking-wider text-sky-700">Caso 2 · Quality (Privacidad)</Text>
              <Text className="text-xs leading-5 text-ink">
                Compra 200 kg de Cerdo en Canal ($500). Desposte: Chuletas (80kg), Costillas (70kg), Pierna (30kg) y merma (20kg). Al cambiar a Rodrigo se comprueba el aislamiento; volviendo a Quality se despachan 40 kg de Costillas (quedan 30 kg).
              </Text>
            </View>
            <View className="gap-1 border-t border-line pt-2">
              <Text className="text-xs font-black uppercase tracking-wider text-emerald-700">Caso 3 · Finilong (Pase Directo)</Text>
              <Text className="text-xs leading-5 text-ink">
                Compra 150 kg de Cajas de Lomo Importado ($1,500). Es producto terminado y no pasa por Desposte. Se despachan 50 kg a cliente VIP y quedan 100 kg.
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </AppShell>
  );
}

