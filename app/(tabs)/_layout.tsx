import { Tabs } from 'expo-router';
import { HomeIcon, TraceabilityIcon } from '../../src/components/ui/Icons.tsx';

export default function TabLayout() {
  return (
    <Tabs initialRouteName="inicio" screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: '#A9431E',
      tabBarInactiveTintColor: '#746F6A',
      tabBarLabelStyle: { fontSize: 12, fontWeight: '700', paddingBottom: 4 },
      tabBarStyle: { height: 64, paddingTop: 6, borderTopColor: '#E5DFD7', backgroundColor: '#FFFFFF' },
    }}>
      <Tabs.Screen
        name="inicio"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <HomeIcon size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trazabilidad"
        options={{
          title: 'Trazabilidad',
          tabBarIcon: ({ color }) => <TraceabilityIcon size={22} color={color} />,
        }}
      />
      {/* Módulos operados directamente desde la cuadrícula principal para no duplicar */}
      <Tabs.Screen name="recepcion" options={{ title: 'Recepción', href: null }} />
      <Tabs.Screen name="desposte" options={{ title: 'Desposte', href: null }} />
      <Tabs.Screen name="inventario" options={{ title: 'Inventario', href: null }} />
      <Tabs.Screen name="despachos" options={{ title: 'Despachos', href: null }} />
    </Tabs>
  );
}


