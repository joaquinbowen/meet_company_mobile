import { Redirect, router } from 'expo-router';
import { Text, View } from 'react-native';
import { PinEntry } from '../../src/components/auth/PinEntry.tsx';
import { ActionButton } from '../../src/components/ui/Primitives.tsx';
import { useSessionStore } from '../../src/store/useSessionStore.ts';

export default function UnlockScreen() {
  const pin = useSessionStore((state) => state.pin);
  const authenticated = useSessionStore((state) => state.isAuthenticated);
  const message = useSessionStore((state) => state.message);
  const unlock = useSessionStore((state) => state.unlock);
  const logout = useSessionStore((state) => state.logout);
  if (!pin) return <Redirect href="/(auth)/login" />;
  if (authenticated) return <Redirect href="/(tabs)/inicio" />;
  return (
    <View className="flex-1 justify-center bg-ink px-5 py-8">
      <Text className="mb-6 text-center text-xs font-bold uppercase tracking-[3px] text-orange-200">Meet Company · Acceso rápido</Text>
      <PinEntry title="Desbloquear operación" message={message} onSubmit={(value) => { if (unlock(value)) router.replace('/(tabs)/inicio'); }} />
      <View className="mt-4">
        <ActionButton tone="outline" label="Cambiar usuario" onPress={() => { logout(); router.replace('/(auth)/login'); }} />
      </View>
    </View>
  );
}
