import { Pressable, Text, View } from 'react-native';
import type { PropsWithChildren, ReactNode } from 'react';

export function PageTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <View className="mb-5 flex-row items-start justify-between gap-3">
      <View className="flex-1">
        <Text className="text-[27px] font-bold tracking-tight text-ink">{title}</Text>
        <Text className="mt-1 text-base leading-6 text-muted">{subtitle}</Text>
      </View>
      {action}
    </View>
  );
}

export function Panel({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <View className={`rounded-2xl border border-line bg-white p-4 ${className}`}>{children}</View>;
}

export function ActionButton({
  label, onPress, tone = 'brand', disabled = false, small = false,
}: { label: string; onPress: () => void; tone?: 'brand' | 'outline' | 'danger'; disabled?: boolean; small?: boolean }) {
  const style = tone === 'brand' ? 'border-brand bg-brand' : tone === 'danger' ? 'border-danger bg-danger' : 'border-line bg-white';
  const textStyle = tone === 'outline' ? 'text-ink' : 'text-white';
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      className={`min-h-12 items-center justify-center rounded-xl border px-4 ${small ? 'min-h-10' : 'min-h-14'} ${style} ${disabled ? 'opacity-40' : 'active:opacity-80'}`}
    >
      <Text className={`text-base font-bold ${textStyle}`}>{label}</Text>
    </Pressable>
  );
}

export function FieldLabel({ children }: PropsWithChildren) {
  return <Text className="mb-2 text-sm font-bold uppercase tracking-wide text-muted">{children}</Text>;
}

export function InfoBanner({ text, tone = 'info' }: { text: string; tone?: 'info' | 'success' | 'warning' | 'error' }) {
  const colors = {
    info: 'border-line bg-white text-ink',
    success: 'border-green-200 bg-green-50 text-success',
    warning: 'border-amber-200 bg-amber-50 text-warning',
    error: 'border-red-200 bg-red-50 text-danger',
  };
  return (
    <View accessibilityRole="alert" className={`rounded-xl border px-4 py-3 ${colors[tone]}`}>
      <Text className={`text-sm font-semibold leading-5 ${colors[tone].split(' ').at(-1)}`}>{text}</Text>
    </View>
  );
}

export function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <View className="min-w-[92px] flex-1 rounded-xl bg-canvas p-3">
      <Text className="text-xs font-bold uppercase tracking-wide text-muted">{label}</Text>
      <Text className="mt-1 text-2xl font-extrabold tabular-nums text-ink">{value}</Text>
      {detail ? <Text className="mt-1 text-xs text-muted">{detail}</Text> : null}
    </View>
  );
}

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return (
    <View className="items-center rounded-2xl border border-dashed border-line bg-white px-6 py-10">
      <Text className="text-lg font-bold text-ink">{title}</Text>
      <Text className="mt-2 text-center text-base leading-6 text-muted">{detail}</Text>
      {action ? <View className="mt-5 w-full">{action}</View> : null}
    </View>
  );
}
