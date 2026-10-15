import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { ActionButton, InfoBanner } from '../../src/components/ui/Primitives.tsx';
import { demoCredentials, useSessionStore } from '../../src/store/useSessionStore.ts';

export default function LoginScreen() {
  const [email, setEmail] = useState(demoCredentials.email);
  const [password, setPassword] = useState(demoCredentials.password);
  const login = useSessionStore((state) => state.login);
  const message = useSessionStore((state) => state.message);
  const hasPin = useSessionStore((state) => Boolean(state.pin));
  const submit = () => {
    if (!login(email, password)) return;
    router.replace(hasPin ? '/(auth)/unlock' : '/(auth)/setup-pin');
  };
  return (
    <View className="flex-1 justify-center bg-ink px-5 py-8">
      <View className="mb-7 rounded-2xl bg-brand p-4">
        <Text className="text-xs font-bold uppercase tracking-[3px] text-orange-100">Operaciones · Frío · Inventario</Text>
        <Text className="mt-2 text-3xl font-extrabold text-white">Meet Company</Text>
        <Text className="mt-2 text-base text-orange-50">Prototipo de operación en planta</Text>
      </View>
      <View className="gap-4 rounded-2xl bg-white p-5">
        <Text className="text-2xl font-bold text-ink">Ingresar</Text>
        <Text className="text-base leading-6 text-muted">Perfil de demostración: operador de la planta Meet Company. Registrarás mercadería de distintos propietarios.</Text>
        <View>
          <Text className="mb-2 text-sm font-bold uppercase text-muted">Correo</Text>
          <TextInput accessibilityLabel="Correo" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} className="min-h-14 rounded-xl border border-line bg-white px-4 text-base text-ink" />
        </View>
        <View>
          <Text className="mb-2 text-sm font-bold uppercase text-muted">Contraseña</Text>
          <TextInput accessibilityLabel="Contraseña" secureTextEntry value={password} onChangeText={setPassword} className="min-h-14 rounded-xl border border-line bg-white px-4 text-base text-ink" />
        </View>
        {message ? <InfoBanner text={message} tone="error" /> : null}
        <ActionButton label="Continuar" onPress={submit} />
        <Pressable accessibilityRole="button" onPress={() => { setEmail(demoCredentials.email); setPassword(demoCredentials.password); }} className="min-h-11 items-center justify-center">
          <Text className="font-bold text-brand">Cargar usuario de demostración</Text>
        </Pressable>
        <Text className="text-center text-sm text-muted">Correo: {demoCredentials.email}{'\n'}Contraseña: {demoCredentials.password}</Text>
      </View>
    </View>
  );
}
