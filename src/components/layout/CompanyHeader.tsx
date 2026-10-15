import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { companies, companyName } from '../../mocks/catalog.ts';
import { useSessionStore } from '../../store/useSessionStore.ts';
import { useDraftStore } from '../../store/useDraftStore.ts';
import type { CompanyId } from '../../domain/types.ts';

const companyBadges: Record<CompanyId, { chipBg: string; border: string; text: string; dot: string; label: string }> = {
  rodrigo: { chipBg: 'bg-amber-600', border: 'border-amber-400', text: 'text-white', dot: 'bg-amber-300', label: 'Rodrigo' },
  quality: { chipBg: 'bg-sky-600', border: 'border-sky-300', text: 'text-white', dot: 'bg-sky-300', label: 'Quality' },
  finilong: { chipBg: 'bg-emerald-600', border: 'border-emerald-300', text: 'text-white', dot: 'bg-emerald-300', label: 'Finilong' },
  meet: { chipBg: 'bg-stone-600', border: 'border-stone-400', text: 'text-white', dot: 'bg-stone-300', label: 'Meet Company' },
};

export function CompanyHeader() {
  const [open, setOpen] = useState(false);
  const [confirmCompanyId, setConfirmCompanyId] = useState<CompanyId | null>(null);
  const activeCompanyId = useSessionStore((state) => state.companyId);
  const changeCompany = useSessionStore((state) => state.changeCompany);

  const chooseCompany = (companyId: CompanyId) => {
    if (companyId === activeCompanyId) { setOpen(false); return; }
    if (Object.keys(useDraftStore.getState().dirtyDrafts).length > 0) {
      setConfirmCompanyId(companyId);
      setOpen(false);
      return;
    }
    changeCompany(companyId);
    setOpen(false);
  };

  const discardAndChange = () => {
    if (confirmCompanyId) changeCompany(confirmCompanyId);
    useDraftStore.getState().clearDrafts();
    setConfirmCompanyId(null);
  };

  const badge = companyBadges[activeCompanyId] ?? companyBadges.meet;

  return (
    <>
      <View className="flex-row items-center justify-between py-1">
        <View className="flex-1 pr-2">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-base font-black tracking-tight text-white">Meet Company</Text>
            <View className="rounded bg-white/20 px-1.5 py-0.5">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-stone-200">Planta</Text>
            </View>
          </View>
          <Text className="text-xs text-stone-400">Operador frigorífico</Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Dueño actual: ${companyName(activeCompanyId)}. Toca para cambiar.`}
          onPress={() => setOpen(true)}
          className={`flex-row items-center gap-2 rounded-xl border px-3 py-2 ${badge.chipBg} ${badge.border} active:opacity-80`}
        >
          <View className={`h-2.5 w-2.5 rounded-full ${badge.dot}`} />
          <View>
            <Text className="text-[10px] font-bold uppercase tracking-wider text-white/80">Mercadería de</Text>
            <Text className={`text-sm font-black ${badge.text}`}>{badge.label} ▾</Text>
          </View>
        </Pressable>
      </View>

      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} className="flex-1 justify-center bg-black/60 px-5">
          <Pressable className="rounded-2xl bg-white p-5 shadow-2xl" onPress={(event) => event.stopPropagation()}>
            <Text className="text-xl font-black text-ink">¿De quién es la mercadería?</Text>
            <Text className="mt-1 text-xs text-muted">Selecciona el cliente del lote que vas a procesar o despachar:</Text>
            <View className="mt-4 gap-2">
              {companies.map((company) => {
                const itemBadge = companyBadges[company.id] ?? companyBadges.meet;
                const isSelected = company.id === activeCompanyId;
                return (
                  <Pressable
                    key={company.id}
                    accessibilityRole="button"
                    onPress={() => chooseCompany(company.id)}
                    className={`min-h-14 flex-row items-center justify-between rounded-xl border px-4 py-3 ${isSelected ? 'border-brand bg-orange-50' : 'border-line bg-white'}`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className={`h-4 w-4 rounded-full ${itemBadge.chipBg}`} />
                      <View>
                        <Text className={`text-base font-bold ${isSelected ? 'text-brand' : 'text-ink'}`}>
                          {company.name}
                        </Text>
                        <Text className="text-xs text-muted">
                          {company.id === 'meet' ? 'Almacén físico propio' : `Lotes de ${company.name}`}
                        </Text>
                      </View>
                    </View>
                    {isSelected ? (
                      <View className="rounded-full bg-brand px-2.5 py-1">
                        <Text className="text-xs font-bold text-white">Activo</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              className="mt-4 min-h-11 items-center justify-center rounded-xl border border-line bg-canvas"
            >
              <Text className="font-bold text-ink">Cancelar</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal transparent visible={confirmCompanyId !== null} animationType="fade" onRequestClose={() => setConfirmCompanyId(null)}>
        <View className="flex-1 items-center justify-center bg-black/60 px-5">
          <View className="w-full rounded-2xl bg-white p-5 shadow-2xl">
            <Text className="text-xl font-bold text-ink">¿Descartar cambios no guardados?</Text>
            <Text className="mt-2 text-base leading-6 text-muted">
              Cambiar a {confirmCompanyId ? companyName(confirmCompanyId) : ''} descartará los datos en edición del formulario actual.
            </Text>
            <View className="mt-5 gap-2">
              <Pressable accessibilityRole="button" onPress={discardAndChange} className="min-h-14 items-center justify-center rounded-xl bg-brand px-4">
                <Text className="font-bold text-white">Descartar y cambiar</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={() => setConfirmCompanyId(null)} className="min-h-14 items-center justify-center rounded-xl border border-line px-4">
                <Text className="font-bold text-ink">Seguir editando</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

