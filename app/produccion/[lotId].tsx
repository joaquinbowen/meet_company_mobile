import { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { ActionButton, InfoBanner, Metric, PageTitle, Panel } from '../../src/components/ui/Primitives.tsx';
import { NumericEntry } from '../../src/components/ui/NumericEntry.tsx';
import { gramsToKg, kgToGrams, sumGrams } from '../../src/domain/weights.ts';
import { outputsForRawProduct, productById } from '../../src/mocks/catalog.ts';
import { scenarios } from '../../src/mocks/scenarios.ts';
import { useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';
import { useDraftStore } from '../../src/store/useDraftStore.ts';
import type { CompanyId } from '../../src/domain/types.ts';

function operationId() { return `split-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }

export default function ProductionScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const companyId = useSessionStore((state) => state.companyId);
  return <ProductionForm key={`${companyId}-${lotId}`} companyId={companyId} lotId={lotId} />;
}

function ProductionForm({ companyId, lotId }: { companyId: CompanyId; lotId: string }) {
  const snapshot = useAppStore((state) => state.snapshot);
  const splitLot = useAppStore((state) => state.split);
  const setDraftDirty = useDraftStore((state) => state.setDirty);
  const draftId = `production-${lotId}`;
  const lot = snapshot.lots.find((item) => item.id === lotId && item.companyId === companyId && item.status === 'available');
  const productIds = lot ? outputsForRawProduct[lot.productId] ?? [] : [];
  const [outputValues, setOutputValues] = useState<Record<string, string>>({});
  const [wasteValue, setWasteValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => () => setDraftDirty(draftId, false), [draftId, setDraftDirty]);

  let draft: { outputs: { productId: string; grams: number }[]; wasteGrams: number; totalGrams: number; usefulGrams: number; error: string | null };
  try {
    const outputs = productIds.map((id) => ({ productId: id, grams: outputValues[id]?.trim() ? kgToGrams(outputValues[id]) : 0 }));
    const wasteGrams = wasteValue.trim() ? kgToGrams(wasteValue) : 0;
    const totalGrams = sumGrams([...outputs.map((item) => item.grams), wasteGrams]);
    draft = { outputs, wasteGrams, totalGrams, usefulGrams: sumGrams(outputs.map((item) => item.grams)), error: null };
  } catch (error) {
    draft = { outputs: [], wasteGrams: 0, totalGrams: 0, usefulGrams: 0, error: error instanceof Error ? error.message : 'Revisa los pesos.' };
  }

  if (!lot) return <AppShell><InfoBanner text="Lote no disponible para la empresa activa. Vuelve a la lista de desposte." tone="error" /><Link href="/(tabs)/desposte" className="rounded-xl bg-brand p-4 text-center font-bold text-white">Volver a desposte</Link></AppShell>;
  const remaining = lot.availableGrams - draft.totalGrams;
  const balanced = !draft.error && remaining === 0 && draft.usefulGrams > 0;
  const percentage = lot.availableGrams ? (draft.usefulGrams / lot.availableGrams * 100) : 0;
  const wastePercentage = lot.availableGrams ? (draft.wasteGrams / lot.availableGrams * 100) : 0;
  const width = `${Math.max(0, Math.min(100, draft.totalGrams / lot.availableGrams * 100))}%` as `${number}%`;
  const loadExample = () => {
    const scenario = scenarios.find((item) => item.companyId === companyId && item.rawProductId === lot.productId);
    if (!scenario) return;
    setOutputValues(Object.fromEntries(scenario.outputs.map((item) => [item.productId, gramsToKg(item.grams)])));
    setWasteValue(gramsToKg(scenario.wasteGrams)); setDraftDirty(draftId, true);
    setMessage(null); setConfirming(false);
  };
  const confirmSplit = async () => {
    if (!balanced || busy) return;
    setBusy(true);
    const result = await splitLot({
      operationId: operationId(), companyId, lotId: lot.id,
      outputs: draft.outputs.filter((item) => item.grams > 0), wasteGrams: draft.wasteGrams,
    });
    setBusy(false);
    if (!result.ok) { setMessage(result.message); setConfirming(false); return; }
    setDraftDirty(draftId, false);
    router.replace('/(tabs)/desposte');
  };

  return (
    <AppShell>
      <PageTitle title="Distribuir lote" subtitle={`${productById(lot.productId)?.name} · Lote ${lot.id.slice(-10)}`} action={<Link href="/(tabs)/desposte" className="rounded-xl border border-line bg-white px-3 py-3 font-bold text-ink">Volver</Link>} />
      <Panel className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-muted">Peso de entrada</Text>
          <Text className="text-3xl font-extrabold tabular-nums text-ink">{gramsToKg(lot.availableGrams)} kg</Text>
        </View>
        <View className="h-3 overflow-hidden rounded-full bg-canvas">
          <View className={`h-3 rounded-full ${remaining < 0 ? 'bg-danger' : balanced ? 'bg-brand' : 'bg-amber-500'}`} style={{ width }} />
        </View>
        <View className="flex-row gap-2">
          <Metric label="Distribuido" value={`${gramsToKg(draft.totalGrams)} kg`} />
          <Metric label={remaining < 0 ? 'Exceso' : 'Por distribuir'} value={`${gramsToKg(Math.abs(remaining))} kg`} />
        </View>
      </Panel>
      <Panel className="gap-4">
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-ink">Cortes y merma</Text>
            <Text className="mt-1 text-sm leading-5 text-muted">Registra todo el peso para cerrar el lote.</Text>
          </View>
          <ActionButton small tone="outline" label="Cargar caso" onPress={loadExample} />
        </View>
        {productIds.map((id) => (
          <NumericEntry key={id} label={productById(id)?.name ?? id} value={outputValues[id] ?? ''} unit="kg" onChange={(value) => { setOutputValues((current) => ({ ...current, [id]: value })); setConfirming(false); setDraftDirty(draftId, true); }} />
        ))}
        <NumericEntry label="Merma · hueso y cebo" value={wasteValue} unit="kg" onChange={(value) => { setWasteValue(value); setConfirming(false); setDraftDirty(draftId, true); }} />
        <View className="flex-row gap-2">
          <Metric label="Rendimiento útil" value={`${percentage.toFixed(1)}%`} detail={`${gramsToKg(draft.usefulGrams)} kg`} />
          <Metric label="Merma" value={`${wastePercentage.toFixed(1)}%`} detail={`${gramsToKg(draft.wasteGrams)} kg`} />
        </View>
        {draft.error ? <InfoBanner text={draft.error} tone="error" /> : null}
        {message ? <InfoBanner text={message} tone="error" /> : null}
        {!balanced && !draft.error ? <InfoBanner text={remaining > 0 ? `Faltan ${gramsToKg(remaining)} kg por distribuir.` : `Excedes el lote por ${gramsToKg(Math.abs(remaining))} kg.`} tone={remaining < 0 ? 'error' : 'warning'} /> : null}
        {confirming ? (
          <View className="gap-3 rounded-xl border border-brand/20 bg-orange-50 p-4">
            <Text className="font-bold text-ink">Confirma el desposte</Text>
            <Text className="text-base leading-6 text-ink">Se cerrará el lote padre y se crearán {draft.outputs.filter((item) => item.grams > 0).length} lotes de cortes. La merma quedará registrada aparte.</Text>
            <ActionButton label={busy ? 'Guardando…' : 'Confirmar desposte'} disabled={busy} onPress={() => void confirmSplit()} />
            <ActionButton label="Seguir editando" tone="outline" onPress={() => setConfirming(false)} />
          </View>
        ) : <ActionButton label="Revisar distribución" disabled={!balanced} onPress={() => setConfirming(true)} />}
      </Panel>
      <Text className="px-1 text-sm leading-5 text-muted">Los kilos de merma se conservan en el movimiento. No aparecen como producto vendible.</Text>
    </AppShell>
  );
}
