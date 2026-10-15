import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from '../src/store/useAppStore.ts';
import { useSessionStore } from '../src/store/useSessionStore.ts';

export default function RootLayout() {
  const hydrateApp = useAppStore((state) => state.hydrate);
  const hydrateSession = useSessionStore((state) => state.hydrate);
  const appReady = useAppStore((state) => state.isHydrated);
  const sessionReady = useSessionStore((state) => state.isHydrated);
  const ready = appReady && sessionReady;
  const authenticated = useSessionStore((state) => state.isAuthenticated);
  const hasPin = Boolean(useSessionStore((state) => state.pin));
  useEffect(() => {
    void Promise.all([hydrateApp(), hydrateSession()]);
  }, [hydrateApp, hydrateSession]);
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F5F3EF' }, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Protected guard={ready && (!authenticated || !hasPin)}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={ready && authenticated && hasPin}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="demo" />
          <Stack.Screen name="produccion/[lotId]" />
          <Stack.Screen name="lotes/[lotId]" />
          <Stack.Screen name="despacho/[lotId]" />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
  );
}
