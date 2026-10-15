import { useState } from 'react';
import { Text, View } from 'react-native';
import { NumericPad } from '../ui/NumericEntry.tsx';
import { InfoBanner } from '../ui/Primitives.tsx';

export function PinEntry({ title, message, onSubmit }: { title: string; message?: string | null; onSubmit: (pin: string) => void }) {
  const [pin, setPin] = useState('');
  return (
    <View className="gap-4 rounded-2xl bg-white p-5">
      <Text className="text-2xl font-bold text-ink">{title}</Text>
      <Text className="text-base leading-6 text-muted">Usa el teclado numérico para ingresar el PIN de cuatro dígitos.</Text>
      <View className="flex-row justify-center gap-3 py-2">
        {[0, 1, 2, 3].map((index) => <View key={index} className={`h-4 w-4 rounded-full border-2 ${pin.length > index ? 'border-brand bg-brand' : 'border-stone-300 bg-white'}`} />)}
      </View>
      {message ? <InfoBanner text={message} tone="error" /> : null}
      <NumericPad maxDecimals={0} value={pin} onChange={(next) => setPin(next.slice(0, 4))} onDone={() => { if (pin.length === 4) onSubmit(pin); }} />
      <Text className="text-center text-sm text-muted">{pin.length}/4 dígitos</Text>
    </View>
  );
}
