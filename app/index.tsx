import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';
import { useAppStore } from '../src/store/useAppStore.ts';
import { useSessionStore } from '../src/store/useSessionStore.ts';
import { ActionButton } from '../src/components/ui/Primitives.tsx';

export default function IndexRoute() {
  const appReady = useAppStore((state) => state.isHydrated);
  const storageError = useAppStore((state) => state.storageError);
  const sessionReady = useSessionStore((state) => state.isHydrated);
  const authenticated = useSessionStore((state) => state.isAuthenticated);
  const pin = useSessionStore((state) => state.pin);
  if (!appReady || !sessionReady) return <View className="flex-1 items-center justify-center bg-canvas"><Text className="text-base font-semibold text-muted">Preparando inventario…</Text></View>;
  if (storageError) return <View className="flex-1 justify-center gap-4 bg-canvas px-6"><Text className="text-lg font-bold text-danger">{storageError}</Text><ActionButton label="Restaurar inventario de demo" onPress={() => { void useAppStore.getState().resetDemo('preloaded'); }} /></View>;
  if (!authenticated) return <Redirect href={pin ? '/(auth)/unlock' : '/(auth)/login'} />;
  if (!pin) return <Redirect href="/(auth)/setup-pin" />;
  return <Redirect href="/(tabs)/inicio" />;
}
