import { useState } from 'react';
import { Redirect, router } from 'expo-router';
import { Text, View } from 'react-native';
import { PinEntry } from '../../src/components/auth/PinEntry.tsx';
import { useSessionStore } from '../../src/store/useSessionStore.ts';

export default function SetupPinScreen() {
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const configurePin = useSessionStore((state) => state.configurePin);
  const pin = useSessionStore((state) => state.pin);
  const authenticated = useSessionStore((state) => state.isAuthenticated);
  const message = useSessionStore((state) => state.message);
  const [localMessage, setLocalMessage] = useState<string | null>(null);
  if (pin) return <Redirect href="/(auth)/unlock" />;
  if (!authenticated) return <Redirect href="/(auth)/login" />;
  const submit = async (value: string) => {
    if (!firstPin) { setFirstPin(value); setLocalMessage(null); return; }
    if (firstPin !== value) { setFirstPin(null); setLocalMessage('Los PIN no coinciden. Empieza de nuevo.'); return; }
    if (await configurePin(value)) router.replace('/(tabs)/inicio');
  };
  return (
    <View className="flex-1 justify-center bg-ink px-5 py-8">
      <Text className="mb-6 text-center text-xs font-bold uppercase tracking-[3px] text-orange-200">Seguridad de demostración</Text>
      <PinEntry key={firstPin ? 'confirm' : 'first'} title={firstPin ? 'Confirma tu PIN' : 'Configura un PIN'} message={localMessage ?? message ?? (firstPin ? 'Ingresa de nuevo el mismo PIN.' : null)} onSubmit={submit} />
      {firstPin ? <Text className="mt-4 text-center text-sm text-white">El PIN se guarda en este dispositivo para esta demo.</Text> : null}
    </View>
  );
}
