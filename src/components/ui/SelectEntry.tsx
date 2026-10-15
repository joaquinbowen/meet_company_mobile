import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { FieldLabel } from './Primitives.tsx';

export type SelectOption = { id: string; label: string; detail?: string };

export function SelectEntry({
  label, value, options, onChange, placeholder = 'Seleccionar',
}: { label: string; value: string; options: SelectOption[]; onChange: (id: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.id === value);
  return (
    <>
      <View>
        <FieldLabel>{label}</FieldLabel>
        <Pressable accessibilityRole="button" onPress={() => setOpen(true)} className="min-h-14 flex-row items-center justify-between rounded-xl border border-line bg-white px-4">
          <View className="flex-1">
            <Text className={`text-base font-bold ${selected ? 'text-ink' : 'text-stone-400'}`}>{selected?.label ?? placeholder}</Text>
            {selected?.detail ? <Text className="mt-1 text-sm text-muted">{selected.detail}</Text> : null}
          </View>
          <Text className="text-muted">⌄</Text>
        </Pressable>
      </View>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable onPress={() => setOpen(false)} className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white p-5 pb-8">
            <Text className="mb-3 text-xl font-bold text-ink">{label}</Text>
            {options.map((option) => (
              <Pressable key={option.id} accessibilityRole="button" onPress={() => { onChange(option.id); setOpen(false); }} className="min-h-14 justify-center border-b border-line px-2 py-2">
                <Text className="text-base font-semibold text-ink">{option.label}</Text>
                {option.detail ? <Text className="mt-1 text-sm text-muted">{option.detail}</Text> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
