import { View, type ColorValue } from 'react-native';

interface IconProps {
  size?: number;
  color?: ColorValue;
}

// 1. Recepción (Bandeja de entrada con flecha de ingreso - Estilo Blueprint Industrial)
export function ReceptionIcon({ size = 24, color = '#B45309' }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Flecha hacia abajo */}
      <View style={{ alignItems: 'center', position: 'absolute', top: 3 * scale }}>
        <View style={{ width: 2.5 * scale, height: 10 * scale, backgroundColor: color as string, borderRadius: 1 }} />
        <View
          style={{
            width: 7 * scale,
            height: 7 * scale,
            borderBottomWidth: 2.5 * scale,
            borderRightWidth: 2.5 * scale,
            borderColor: color as string,
            transform: [{ rotate: '45deg' }],
            marginTop: -4 * scale,
          }}
        />
      </View>
      {/* Bandeja receptora */}
      <View
        style={{
          position: 'absolute',
          bottom: 2 * scale,
          width: 18 * scale,
          height: 8 * scale,
          borderLeftWidth: 2.2 * scale,
          borderRightWidth: 2.2 * scale,
          borderBottomWidth: 2.2 * scale,
          borderColor: color as string,
          borderBottomLeftRadius: 3 * scale,
          borderBottomRightRadius: 3 * scale,
        }}
      />
    </View>
  );
}

// 2. Desposte (Hacha / Cuchilla de carnicería industrial)
export function CutIcon({ size = 24, color = '#BE123C' }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ transform: [{ rotate: '-30deg' }] }}>
        {/* Hoja ancha de corte */}
        <View
          style={{
            width: 13 * scale,
            height: 9 * scale,
            borderWidth: 2 * scale,
            borderColor: color as string,
            backgroundColor: `${color as string}20`,
            borderTopLeftRadius: 4 * scale,
            borderBottomRightRadius: 2 * scale,
          }}
        />
        {/* Mango */}
        <View
          style={{
            position: 'absolute',
            bottom: -8 * scale,
            left: 1 * scale,
            width: 3.5 * scale,
            height: 9 * scale,
            backgroundColor: color as string,
            borderRadius: 1.5 * scale,
          }}
        />
      </View>
    </View>
  );
}

// 3. Inventario (Caja / Pallet de almacenamiento en frío)
export function InventoryIcon({ size = 24, color = '#0369A1' }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Caja principal */}
      <View
        style={{
          width: 16 * scale,
          height: 16 * scale,
          borderWidth: 2 * scale,
          borderColor: color as string,
          borderRadius: 3 * scale,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Línea de cinta / apertura */}
        <View
          style={{
            width: 6 * scale,
            height: 16 * scale,
            borderLeftWidth: 1.5 * scale,
            borderRightWidth: 1.5 * scale,
            borderColor: color as string,
            backgroundColor: `${color as string}20`,
          }}
        />
      </View>
    </View>
  );
}

// 4. Despachos (Camión de reparto / Salida de planta)
export function DispatchIcon({ size = 24, color = '#047857' }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Cabina y chasis */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 * scale }}>
        {/* Contenedor de carga */}
        <View
          style={{
            width: 11 * scale,
            height: 11 * scale,
            borderWidth: 2 * scale,
            borderColor: color as string,
            borderTopLeftRadius: 2 * scale,
            backgroundColor: `${color as string}15`,
          }}
        />
        {/* Cabina */}
        <View
          style={{
            width: 7 * scale,
            height: 8 * scale,
            borderWidth: 2 * scale,
            borderLeftWidth: 0,
            borderColor: color as string,
            borderTopRightRadius: 4 * scale,
          }}
        />
      </View>
      {/* Ruedas */}
      <View style={{ flexDirection: 'row', width: 17 * scale, justifyContent: 'space-between', marginTop: -2 * scale }}>
        <View
          style={{
            width: 4 * scale,
            height: 4 * scale,
            borderRadius: 2 * scale,
            backgroundColor: color as string,
          }}
        />
        <View
          style={{
            width: 4 * scale,
            height: 4 * scale,
            borderRadius: 2 * scale,
            backgroundColor: color as string,
          }}
        />
      </View>
    </View>
  );
}

// 5. Trazabilidad (Lupa de inspección / Auditoría de lotes)
export function TraceabilityIcon({ size = 24, color = '#6B21A8' }: IconProps) {
  const scale = size / 24;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Lente circular */}
      <View
        style={{
          width: 13 * scale,
          height: 13 * scale,
          borderRadius: 6.5 * scale,
          borderWidth: 2.2 * scale,
          borderColor: color as string,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -2 * scale,
          marginLeft: -3 * scale,
        }}
      >
        <View style={{ width: 2 * scale, height: 2 * scale, borderRadius: 1, backgroundColor: color as string }} />
      </View>
      {/* Mango diagonal */}
      <View
        style={{
          position: 'absolute',
          bottom: 3 * scale,
          right: 3 * scale,
          width: 2.5 * scale,
          height: 7 * scale,
          backgroundColor: color as string,
          borderRadius: 1 * scale,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

// 6. Inicio (Silueta de almacén / Planta física)
export function HomeIcon({ size = 22, color = '#746F6A' }: IconProps) {
  const scale = size / 22;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Techo triangular */}
      <View
        style={{
          width: 12 * scale,
          height: 12 * scale,
          borderTopWidth: 2 * scale,
          borderLeftWidth: 2 * scale,
          borderColor: color as string,
          transform: [{ rotate: '45deg' }],
          marginTop: 2 * scale,
        }}
      />
      {/* Base */}
      <View
        style={{
          width: 13 * scale,
          height: 8 * scale,
          borderLeftWidth: 2 * scale,
          borderRightWidth: 2 * scale,
          borderBottomWidth: 2 * scale,
          borderColor: color as string,
          marginTop: -4 * scale,
        }}
      />
    </View>
  );
}

// 7. Guía técnica (Clipboard)
export function GuideIcon({ size = 18, color = '#746F6A' }: IconProps) {
  const scale = size / 18;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Clip superior */}
      <View
        style={{
          width: 6 * scale,
          height: 3 * scale,
          backgroundColor: color as string,
          borderRadius: 1 * scale,
          marginBottom: -1 * scale,
          zIndex: 1,
        }}
      />
      {/* Hoja / Tabla */}
      <View
        style={{
          width: 12 * scale,
          height: 14 * scale,
          borderWidth: 1.8 * scale,
          borderColor: color as string,
          borderRadius: 2 * scale,
          paddingTop: 3 * scale,
          alignItems: 'center',
          gap: 2 * scale,
        }}
      >
        <View style={{ width: 6 * scale, height: 1.5 * scale, backgroundColor: color as string, borderRadius: 0.5 }} />
        <View style={{ width: 4 * scale, height: 1.5 * scale, backgroundColor: color as string, borderRadius: 0.5 }} />
      </View>
    </View>
  );
}
