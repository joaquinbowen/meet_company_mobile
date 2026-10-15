import type { PropsWithChildren } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompanyHeader } from './CompanyHeader.tsx';
import { SyncBar } from './SyncBar.tsx';
import { Link } from 'expo-router';
import { InfoBanner } from '../ui/Primitives.tsx';
import { useAppStore } from '../../store/useAppStore.ts';

export function AppShell({ children }: PropsWithChildren) {
  const notice = useAppStore((state) => state.notice);
  const clearNotice = useAppStore((state) => state.clearNotice);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(clearNotice, 5000);
    return () => clearTimeout(timer);
  }, [notice, clearNotice]);
  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={['top']}>
      <View className="bg-ink px-4 pb-2.5 pt-2">
        <CompanyHeader />
        <SyncBar />
      </View>
      <ScrollView className="flex-1" contentContainerClassName="gap-3.5 px-4 pb-8 pt-4" keyboardShouldPersistTaps="handled">
        {notice ? <InfoBanner text={notice.message} tone={notice.tone} /> : null}
        {children}
        <Text className="pt-2 text-center text-xs text-stone-400">Meet Company · Prototipo Operativo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

