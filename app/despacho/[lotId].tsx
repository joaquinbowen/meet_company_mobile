import { useEffect, useState } from 'react';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { Text, TextInput, View } from 'react-native';
import { AppShell } from '../../src/components/layout/AppShell.tsx';
import { ActionButton, InfoBanner, PageTitle, Panel } from '../../src/components/ui/Primitives.tsx';
import { NumericEntry } from '../../src/components/ui/NumericEntry.tsx';
import { gramsToKg, kgToGrams } from '../../src/domain/weights.ts';
import { productById } from '../../src/mocks/catalog.ts';
import { useAppStore } from '../../src/store/useAppStore.ts';
import { useSessionStore } from '../../src/store/useSessionStore.ts';
import { useDraftStore } from '../../src/store/useDraftStore.ts';
import type { CompanyId } from '../../src/domain/types.ts';

function newOperationId() { return `dispatch-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`; }

export default function DispatchScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const companyId = useSessionStore((state) => state.companyId);
  return <DispatchForm key={`${companyId}-${lotId}`} companyId={companyId} lotId={lotId} />;
}

function DispatchForm({ companyId, lotId }: { companyId: CompanyId; lotId: string }) {
  const snapshot = useAppStore((state) => state.snapshot);
  const dispatchLot = useAppStore((state) => state.dispatch);
  const setDraftDirty = useDraftStore((state) => state.setDirty);
  const draftId = `dispatch-${lotId}`;
  const lot = snapshot.lots.find((item) => item.id === lotId && item.companyId === companyId && item.status === 'available');
  const [weight, setWeight] = useState('');
  const [customer, setCustomer] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => () => setDraftDirty(draftId, false), [draftId, setDraftDirty]);
  if (!lot) return <AppShell><InfoBanner text="Lote no disponible para la empresa activa." tone="error" /><Link href="/(tabs)/inventario" className="rounded-xl bg-brand p-4 text-center font-bold text-white">Volver al inventario</Link></AppShell>;
  let grams = 0;
  try { grams = weight ? kgToGrams(weight) : 0; } catch { grams = 0; }
  const remaining = lot.availableGrams - grams;
  const validate = () => {
    try {
      const amount = kgToGrams(weight);
      if (amount <= 0) throw new Error('El despacho debe ser mayor que cero.');
      if (amount > lot.availableGrams) throw new Error('El despacho supera el peso disponible.');
      setConfirmation(amount); setMessage(null);
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Revisa el peso.'); }
  };
  const confirmDispatch = async () => {
    if (confirmation === null || busy) return;
    setBusy(true);
    const result = await dispatchLot({ operationId: newOperationId(), companyId, lotId: lot.id, grams: confirmation, customerLabel: customer });
    setBusy(false);
    if (!result.ok) { setMessage(result.message); setConfirmation(null); return; }
    setDraftDirty(draftId, false);
    router.replace(`/lotes/${lot.id}` as never);
  };
  return (
    <AppShell>
      <PageTitle title="Registrar despacho" subtitle={`${productById(lot.productId)?.name} · Lote ${lot.id.slice(-10)}`} />
      <Panel className="gap-4">
        <View className="flex-row items-center justify-between rounded-xl bg-canvas p-4">
          <View><Text className="text-sm font-bold uppercase text-muted">Disponible</Text><Text className="mt-1 text-2xl font-extrabold text-ink">{gramsToKg(lot.availableGrams)} kg</Text></View>
          <Text className="text-sm font-semibold text-muted">Meet Company</Text>
        </View>
        <NumericEntry label="Peso a despachar" value={weight} unit="kg" onChange={(value) => { setWeight(value); setConfirmation(null); setDraftDirty(draftId, true); }} />
        <View>
          <Text className="mb-2 text-sm font-bold uppercase text-muted">Cliente · opcional</Text>
          <TextInput value={customer} onChangeText={(value) => { setCustomer(value); setDraftDirty(draftId, true); }} placeholder="Ej. Cliente VIP" className="min-h-14 rounded-xl border border-line bg-white px-4 text-base text-ink" />
        </View>
        <View className="flex-row items-center justify-between rounded-xl border border-line p-4">
          <Text className="font-semibold text-muted">Saldo después del despacho</Text>
          <Text className={`text-xl font-extrabold ${remaining < 0 ? 'text-danger' : 'text-ink'}`}>{gramsToKg(Math.max(0, remaining))} kg</Text>
        </View>
        {message ? <InfoBanner text={message} tone="error" /> : null}
        {confirmation !== null ? (
          <View className="gap-3 rounded-xl border border-brand/20 bg-orange-50 p-4">
            <InfoBanner text={`Confirmar salida de ${gramsToKg(confirmation)} kg. Quedarán ${gramsToKg(lot.availableGrams - confirmation)} kg.`} tone="success" />
            <ActionButton label={busy ? 'Guardando…' : 'Confirmar despacho'} disabled={busy} onPress={() => void confirmDispatch()} />
            <ActionButton label="Editar salida" tone="outline" onPress={() => setConfirmation(null)} />
          </View>
        ) : <ActionButton label="Revisar despacho" onPress={validate} />}
      </Panel>
      <Link href="/(tabs)/inventario" className="rounded-xl border border-line bg-white p-4 text-center font-bold text-ink">Cancelar y volver</Link>
    </AppShell>
  );
}
