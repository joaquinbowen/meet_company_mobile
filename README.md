# Meet Company · Prototipo de planta

Aplicación móvil para demostrar recepción, desposte, inventario, despachos y operación offline simulada. Corre con Expo Go; no necesita backend.

## Requisitos y arranque

- Node.js 24 o compatible con el SDK instalado.
- pnpm 10.
- Expo Go compatible con Expo SDK 57.

```sh
pnpm install
pnpm start
```

Escanea el QR con Expo Go. Para generar la versión web local, usa `pnpm web`.

## Acceso de demo

- Correo: `operador@meetcompany.demo`
- Contraseña: `planta2026`
- En el primer acceso, define y confirma un PIN de cuatro dígitos. La siguiente apertura solicita el PIN.

Las credenciales y el PIN son solo para esta demo. No son autenticación segura para uso real.

## Recorridos

La app inicia con tres recepciones precargadas. En “Controles de demostración” puedes vaciar el inventario para capturar las compras durante la presentación o restaurar los tres lotes de inicio.

1. Rodrigo recibe 400 kg de Res Entera por $1,200. Desposte: Lomo Fino 100 kg, Churrasco 150 kg, Carne para Guiso 100 kg y merma 50 kg. El rendimiento útil es 87.5%. Despachar 30 kg de Lomo Fino deja 70 kg.
2. Quality recibe 200 kg de Cerdo en Canal por $500. Desposte: Chuletas 80 kg, Costillas 70 kg, Pierna 30 kg y merma 20 kg. Cambia a Rodrigo para comprobar el aislamiento; vuelve a Quality y despacha 40 kg de Costillas. Saldo: 30 kg.
3. Finilong recibe 150 kg de Cajas de Lomo Importado Premium por $1,500. El lote queda listo para venta y no aparece en Desposte. Despachar 50 kg al Cliente VIP deja 100 kg.

El almacén físico de los tres casos es Meet Company. La empresa activa controla la visibilidad de los lotes y las operaciones.

La barra superior simula la señal. Al operar offline, el movimiento se guarda en este dispositivo y entra en la cola. Al reconectar, la demo confirma esa cola con una animación; no existe envío a servidor.

## Validaciones

```sh
pnpm typecheck
pnpm test
pnpm lint
pnpm exec expo install --check
pnpm exec expo export --platform web
```

## Límites de la demo

Zustand administra el estado de la app y AsyncStorage conserva el inventario entre aperturas. El aislamiento por empresa es una regla de UI y lógica local, no control de acceso de servidor. No hay facturas, impresión, conexión a balanzas, costos distribuidos entre cortes ni sincronización real.

> Ejecuta pnpm desde esta carpeta mobile/ (no desde la raíz del workspace).
