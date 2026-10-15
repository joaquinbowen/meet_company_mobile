import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { ActionButton, FieldLabel } from './Primitives.tsx';

export function NumericPad({
  value, onChange, onDone, maxDecimals = 3,
}: { value: string; onChange: (value: string) => void; onDone: () => void; maxDecimals?: number }) {
  const add = (key: string) => {
    if (key === '⌫') return onChange(value.slice(0, -1));
    if (key === 'Borrar') return onChange('');
    if (key === ',' || key === '.') {
      if (!maxDecimals || /[,.]/.test(value)) return;
      return onChange(value ? `${value},` : '0,');
    }
    const fraction = value.split(/[,.]/)[1] ?? '';
    if (/[,.]/.test(value) && fraction.length >= maxDecimals) return;
    onChange(`${value}${key}`);
  };
  const keys = maxDecimals ? ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '⌫'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Borrar', '0', '⌫'];
  return (
    <View className="rounded-2xl bg-canvas p-3">
      <View className="mb-2 flex-row flex-wrap">
        {keys.map((key) => (
          <Pressable key={key} accessibilityRole="button" accessibilityLabel={key === '⌫' ? 'Borrar último dígito' : key} onPress={() => add(key)} className="w-1/3 p-1">
            <View className="h-14 items-center justify-center rounded-xl border border-line bg-white">
              <Text className="text-xl font-bold text-ink">{key}</Text>
            </View>
          </Pressable>
        ))}
      </View>
      <ActionButton label="Listo" onPress={onDone} />
    </View>
  );
}

export function NumericEntry({
  label, value, unit, onChange, maxDecimals = 3,
}: { label: string; value: string; unit: string; onChange: (value: string) => void; maxDecimals?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <View>
        <FieldLabel>{label}</FieldLabel>
        <Pressable accessibilityRole="button" onPress={() => setOpen(true)} className="min-h-14 flex-row items-center justify-between rounded-xl border border-line bg-white px-4">
          <Text className={`text-xl font-bold tabular-nums ${value ? 'text-ink' : 'text-stone-400'}`}>{value || 'Tocar para ingresar'}</Text>
          <Text className="text-sm font-bold text-muted">{unit}</Text>
        </Pressable>
      </View>
      <Modal transparent visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white p-5 pb-8">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-ink">{label}</Text>
              <Pressable accessibilityRole="button" onPress={() => setOpen(false)}><Text className="p-2 text-base font-bold text-brand">Cerrar</Text></Pressable>
            </View>
            <View className="mb-4 flex-row items-baseline justify-between rounded-xl bg-canvas p-4">
              <Text className="text-3xl font-extrabold text-ink">{value || '0'}</Text>
              <Text className="text-base font-bold text-muted">{unit}</Text>
            </View>
            <NumericPad value={value} onChange={onChange} maxDecimals={maxDecimals} onDone={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}
