import { useCallback, useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Text, TextInput, View } from 'react-native';
import { ActionButton, InfoBanner, PageTitle, Panel } from '../../src/components/ui/Primitives.tsx';
import { NumericEntry } from '../../src/components/ui/NumericEntry.tsx';
import { SelectEntry } from '../../src/components/ui/SelectEntry.tsx';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { products, productById } from '../../src/mocks/catalog.ts';
import { scenarios } from '../../src/mocks/scenarios.ts';
import { useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';
import { useDraftStore } from '../../src/store/useDraftStore.ts';
import { centsToUsd, gramsToKg, kgToGrams, usdToCents } from '../../src/domain/weights.ts';

function newOperationId() { return `receipt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }

export default function ReceptionScreen() {
  const companyId = useSessionStore((state) => state.companyId);
  const changeCompany = useSessionStore((state) => state.changeCompany);
  const setDraftDirty = useDraftStore((state) => state.setDirty);
  const draftDirty = useDraftStore((state) => Boolean(state.dirtyDrafts.receipt));
  const draftId = 'receipt';
  const receive = useAppStore((state) => state.receive);
  const [productId, setProductId] = useState('');
  const [weight, setWeight] = useState('');
  const [cost, setCost] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ productId: string; grams: number; costCents: number } | null>(null);
  const pendingPreset = useRef<(typeof scenarios)[number] | null>(null);
  const [busy, setBusy] = useState(false);
  const product = productById(productId);
  const totalGrams = (() => { try { return weight ? kgToGrams(weight) : 0; } catch { return 0; } })();
  const totalCents = (() => { try { return cost ? usdToCents(cost) : 0; } catch { return 0; } })();
  const unitPrice = totalGrams > 0 ? (totalCents / 100 / (totalGrams / 1000)).toFixed(2) : '—';

  const applyPreset = useCallback((scenario: (typeof scenarios)[number]) => {
    setProductId(scenario.rawProductId ?? scenario.finishedProductId ?? '');
    setWeight(gramsToKg(scenario.receiptGrams));
    setCost(centsToUsd(scenario.costCents));
    setCustomerNote(''); setMessage(null); setConfirmation(null); setDraftDirty(draftId, true);
  }, [draftId, setDraftDirty]);

  useEffect(() => {
    const preset = pendingPreset.current;
    if (preset?.companyId === companyId) {
      pendingPreset.current = null;
      applyPreset(preset);
      return;
    }
    setProductId(''); setWeight(''); setCost(''); setCustomerNote(''); setConfirmation(null); setMessage(null); setDraftDirty(draftId, false);
  }, [companyId, applyPreset, draftId, setDraftDirty]);

  const loadScenario = (id: string) => {
    const scenario = scenarios.find((item) => item.id === id);
    if (!scenario) return;
    if (useDraftStore.getState().dirtyDrafts[draftId]) { setMessage('Descarta los datos actuales antes de cargar otro caso.'); return; }
    if (companyId === scenario.companyId) applyPreset(scenario);
    else { pendingPreset.current = scenario; changeCompany(scenario.companyId); }
  };

  const prepareReceipt = () => {
    try {
      if (!productId) throw new Error('Selecciona un producto.');
      const grams = kgToGrams(weight);
      const costCents = usdToCents(cost);
      if (grams <= 0) throw new Error('El peso debe ser mayor que cero.');
      setConfirmation({ productId, grams, costCents });
      setMessage(null);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Revisa los datos.'); }
  };

  const confirmReceipt = async () => {
    if (!confirmation || busy) return;
    setBusy(true);
    const result = await receive({ operationId: newOperationId(), companyId, ...confirmation, supplierLabel: customerNote });
    setBusy(false);
    if (!result.ok) { setMessage(result.message); setConfirmation(null); return; }
    const lotId = result.value;
    setMessage('Recepción guardada en inventario.');
    setProductId(''); setWeight(''); setCost(''); setCustomerNote(''); setConfirmation(null);
    setDraftDirty(draftId, false);
    router.push(`/lotes/${lotId}`);
  };

  return (
    <AppShell>
      <PageTitle title="Recepción" subtitle="Registra materia prima o producto terminado. Todo se almacena en Meet Company." />
      <Panel>
        <Text className="text-base font-bold text-ink">Precargar un caso</Text>
        <Text className="mb-3 mt-1 text-sm leading-5 text-muted">Carga valores de ejemplo y confirma cada recepción.</Text>
        <View className="gap-2">
          {scenarios.map((scenario) => <ActionButton key={scenario.id} small tone="outline" label={`Caso ${scenario.id === 'rodrigo' ? '1 · Rodrigo' : scenario.id === 'quality' ? '2 · Quality' : '3 · Finilong'}`} onPress={() => loadScenario(scenario.id)} />)}
        </View>
        {draftDirty ? <View className="mt-3"><ActionButton small tone="outline" label="Descartar datos sin guardar" onPress={() => { setProductId(''); setWeight(''); setCost(''); setCustomerNote(''); setConfirmation(null); setMessage(null); setDraftDirty(draftId, false); }} /></View> : null}
      </Panel>
      <Panel className="gap-4">
        <Text className="text-lg font-bold text-ink">Datos de compra</Text>
        <SelectEntry label="Producto" value={productId} onChange={(id) => { setProductId(id); setConfirmation(null); setDraftDirty(draftId, true); }} options={products.filter((item) => item.kind !== 'cut').map((item) => ({ id: item.id, label: item.name, detail: item.kind === 'raw' ? 'Materia prima · requiere desposte' : 'Producto terminado · disponible para venta' }))} />
        <NumericEntry label="Peso recibido" value={weight} unit="kg" onChange={(value) => { setWeight(value); setConfirmation(null); setDraftDirty(draftId, true); }} />
        <NumericEntry label="Costo total" value={cost} unit="USD" maxDecimals={2} onChange={(value) => { setCost(value); setConfirmation(null); setDraftDirty(draftId, true); }} />
        <View>
          <Text className="mb-2 text-sm font-bold uppercase text-muted">Referencia opcional</Text>
          <TextInput value={customerNote} onChangeText={(value) => { setCustomerNote(value); setDraftDirty(draftId, true); }} placeholder="Proveedor o nota de compra" className="min-h-14 rounded-xl border border-line bg-white px-4 text-base text-ink" />
        </View>
        <View className="flex-row items-center justify-between rounded-xl bg-canvas p-3">
          <Text className="text-sm font-semibold text-muted">Costo calculado por kg</Text>
          <Text className="text-lg font-extrabold text-ink">{unitPrice === '—' ? '—' : `$${unitPrice}`}</Text>
        </View>
        {message ? <InfoBanner text={message} tone={message.startsWith('Recepción') ? 'success' : 'error'} /> : null}
        {confirmation ? (
          <View className="gap-3 rounded-xl border border-brand/20 bg-orange-50 p-4">
            <Text className="font-bold text-ink">Confirma el ingreso</Text>
            <Text className="text-base leading-6 text-ink">{product?.name} · {gramsToKg(confirmation.grams)} kg · ${centsToUsd(confirmation.costCents)} USD{customerNote ? ` · ${customerNote}` : ''}</Text>
            <ActionButton label={busy ? 'Guardando…' : 'Confirmar recepción'} disabled={busy} onPress={() => void confirmReceipt()} />
            <ActionButton label="Editar datos" tone="outline" onPress={() => setConfirmation(null)} />
          </View>
        ) : <ActionButton label="Revisar recepción" onPress={prepareReceipt} />}
      </Panel>
    </AppShell>
  );
}
