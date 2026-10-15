# Especificaciones Técnicas: Prototipo Frontend (Datos Simulados)

## 1. Stack Tecnológico
- **Framework:** React Native.
- **Entorno:** Expo Go.
- **Lenguaje:** TypeScript (Interfaces estrictas para simular la BDD).
- **Gestor de Paquetes:** `pnpm`.
- **Estilos:** NativeWind (Tailwind CSS).
- **Navegación:** Expo Router (File-based routing).
- **Estado Global:** `zustand` (Actuará como nuestra base de datos en memoria).

## 2. Manejo de Estado y Datos (Zustand + Mocks)
No habrá SQLite ni Drizzle en esta fase. Todo el sistema vivirá en hooks de Zustand persistidos temporalmente en memoria (o con `AsyncStorage` si se desea mantener el estado al recargar la app en Expo).

Se crearán dos stores principales:
1. `useAppStore`: Manejará las colecciones de datos simulados (usuarios, empresas, productos, inventario).
2. `useSyncStore`: Manejará la UI de la red simulada (isOnline, pendingSyncCount).

## 3. Datos Quemados (Seed Data inicial en Zustand)
Al iniciar la app, el store debe precargar:
- **Empresas:** 4 registros fijos (Meet Company, Rodrigo, Quality, Finilong).
- **Productos:** Res Entera y Cerdo en Canal como materia prima; Lomo Fino, Churrasco, Carne para Guiso, Chuletas de Cerdo, Costillas y Pierna como cortes; Cajas de Lomo Importado Premium como producto terminado.
- **Flujos y lotes iniciales:** La fuente de verdad es [casos_de_uso_flujos_simulados.md](casos_de_uso_flujos_simulados.md). Rodrigo inicia con 400 kg de Res Entera, Quality con 200 kg de Cerdo en Canal y Finilong con 150 kg de producto terminado. Cada compra tiene su costo simulado.
- **Dos modos de inicio:** recepciones precargadas para empezar por desposte/despacho, o inventario vacío para registrar las tres compras durante la demo. Meet Company es el almacén físico de esos lotes y no recibe existencias propias por ese hecho.

Los registros incluyen ID, empresa propietaria, producto, clase, peso inicial y disponible, estado, almacén físico y relación con el lote padre cuando aplica. Las recepciones, transformaciones, mermas y despachos se conservan como movimientos; la propiedad lógica no cambia durante el flujo.

## 4. Estructura de Carpetas Propuesta

```text
/app                   # Rutas de Expo Router (screens)
  /(auth)              # Login simulado y PIN pad
  /(tabs)              # Inicio, Recepción, Desposte, Inventario, Despachos y Trazabilidad
  demo.tsx             # Reinicio de demo y modo offline
/src
  /components          # Formularios, listados y controles de planta
  /domain              # Tipos, comandos, reglas, selectores y cálculos
  /store               # Inventario, sesión y red simulada
  /mocks               # Catálogo, escenarios y lotes iniciales
  /storage             # Persistencia del estado en AsyncStorage
  /theme               # Tokens visuales
```

## 5. Diseño UX / UI para Planta (Cuarto Frío)

Contraste: Fondos oscuros o claros con elementos de acción altamente contrastantes.

Interacción: Teclados numéricos nativos creados desde cero en la app (botones grandes) para evitar el teclado del sistema operativo (que es pequeño e incómodo con guantes).

Feedback: Uso de colores de estado (Verde: Guardado/Sincronizado, Naranja: Pendiente/Offline, Rojo: Error de validación de peso).
