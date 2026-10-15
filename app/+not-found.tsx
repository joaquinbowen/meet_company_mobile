import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-3 bg-canvas px-6">
      <Text className="text-2xl font-bold text-ink">Pantalla no encontrada</Text>
      <Text className="text-center text-base leading-6 text-muted">Ese enlace ya no está disponible. Vuelve al inicio de la operación.</Text>
      <Link href="/" className="mt-3 rounded-xl bg-brand px-5 py-4 font-bold text-white">Volver al inicio</Link>
    </View>
  );
}
