# Plan de implementación integral del prototipo de planta

> Implementación realizada el 14 de octubre de 2026. Las casillas y notas siguientes registran el alcance completado; quedan anotadas las verificaciones que requieren un dispositivo físico.

**Objetivo:** entregar una aplicación móvil demostrable en Expo Go con recepción, desposte, inventario, despachos, acceso con PIN y sincronización simulada.

**Arquitectura:** React Native con Expo Router y TypeScript. Zustand administra los datos y operaciones; AsyncStorage conserva una instantánea local entre reinicios. Las reglas de negocio viven fuera de las pantallas.

**Stack:** React Native, Expo Go, TypeScript, pnpm, NativeWind, Expo Router, Zustand y AsyncStorage. Elegir versiones compatibles con el SDK de Expo instalado al ejecutar el plan; fijarlas en el lockfile.

**Fecha:** 14 de octubre de 2026.

## 1. Fuentes, decisiones y alcance

La fuente principal de datos es `casos_de_uso_flujos_simulados.md`. Prevalece sobre los ejemplos anteriores de `especificaciones_tecnicas.md` y `panorama_general.md`.

Se conservan cuatro empresas: Meet Company, Rodrigo, Quality y Finilong. Meet Company es además el almacén físico único. Su inventario propio inicia vacío; no recibe automáticamente los lotes almacenados físicamente allí.

Se descartan los ejemplos anteriores de 250 kg de cerdo para Meet, 80 kg de lomo para Quality y 120 kg de aguja para Finilong. Se sustituyen por los tres casos confirmados.

La autenticación, los permisos y la red son simulados. El aislamiento se aplica tanto en las consultas como en las mutaciones locales. No constituye seguridad de servidor.

Incluye uso en teléfono y adaptación a tableta. Idioma español, pesos en kg y costos en USD. No incluye facturación, impresión, balanzas, backend, sincronización real ni cálculo de rentabilidad.

### Enfoques considerados

1. **Aplicación Expo con persistencia local — recomendado.** Respeta el stack, permite demostrar operaciones reales sobre datos y conservar avances.
2. **Mockup de pantallas enlazadas.** Más rápido, pero no demuestra balances, stock ni recuperación de operaciones.
3. **Aplicación con backend.** Permite usuarios reales, pero aumenta el alcance y contradice la fase definida.

### Supuestos de diseño propuestos

- Teléfono como formato principal, orientación vertical; tableta con espacio adicional para resúmenes.
- Tema claro de alto contraste y cabecera oscura. El modo oscuro queda fuera de esta primera entrega.
- Un operador de demostración puede cambiar entre las cuatro empresas.
- Desposte completo del lote: no se permiten transformaciones parciales en esta fase.
- La merma queda registrada en el movimiento; no crea existencias vendibles.
- El costo se captura en recepción. No se inventa una distribución de costos entre cortes.

## 2. Dirección visual y experiencia en planta

**Modo de uso: operar.** Priorizar empresa activa, producto, kilos disponibles y siguiente acción. La calidad visual proviene de tipografía, alineación, proporciones y estados consistentes.

### Sistema visual propuesto

| Elemento | Decisión |
|---|---|
| Fondo | Gris frío muy claro, #F3F6F7 |
| Superficies | Blanco, #FFFFFF |
| Cabecera y texto principal | Azul carbón, #172B35 |
| Acción principal | Verde petróleo, #0B665C, texto blanco |
| Texto secundario | Gris azulado, #475569 |
| Separadores | #D8E1E5 |
| Éxito | Verde oscuro, #166534, acompañado de texto e icono |
| Pendiente | Fondo ámbar suave, texto #92400E |
| Error | Rojo oscuro, #B91C1C, con explicación junto al campo |
| Tipografía | Fuente del sistema; cifras tabulares cuando estén disponibles |
| Escala | Cuerpo 16–18, etiquetas 14–16, títulos 24–28, pesos clave 32–40 |
| Espaciado | Base de 4; márgenes de 16–24 |
| Controles | Altura preferida 56–64; mínimo 48 unidades lógicas |
| Teclado numérico | Teclas de al menos 64 de alto y separación de 8 |
| Formas | Radios de 12–16, bordes discretos, sombras escasas |

Verificar contraste de las combinaciones reales, también para foco y estados deshabilitados. No usar solo color para indicar empresa, error o sincronización.

### Composición común

1. Cabecera: nombre de empresa activa y selector grande.
2. Indicador secundario: “Almacén físico: Meet Company”.
3. Barra de conexión: “Conectado”, “Sin conexión · 2 pendientes” o “Sincronizando”.
4. Título de tarea y contenido principal.
5. Acción principal visible al pie, respetando el área segura.
6. Navegación inferior: Recepción, Desposte e Inventario. El despacho nace desde un lote del inventario.

Evitar gráficos decorativos, tablas densas en móvil, texto pequeño, gestos ocultos y controles solo con iconos. Las listas muestran nombre del producto, lote, peso y estado. Los detalles secundarios se consultan al abrir el lote.

### Ergonomía y estados

- Teclado interno para PIN, pesos y costos; teclado del sistema para email y texto libre.
- Admitir coma o punto decimal, sin separadores de miles al introducir cantidades.
- Mostrar unidades junto al valor. Mantener visible el campo mientras se usa el teclado.
- Botones de borrar y corregir; ninguna operación irreversible al pulsar un número.
- Antes de guardar un movimiento, mostrar empresa, producto, kilos y saldo resultante.
- Mientras se guarda, desactivar el botón para evitar pulsaciones repetidas.
- Confirmación breve y persistencia del resultado; vibración opcional, nunca como única señal.
- Texto ampliado y lector de pantalla: etiquetas, roles, orden de foco y anuncios de errores.
- Movimiento reducido: sustituir animaciones por cambios de estado claros.
- Listas vacías con acción útil: “Sin lotes para despostar. Registrar recepción”.
- Cambio de empresa con formulario abierto: ofrecer “Descartar y cambiar” o “Seguir editando”.
- En tableta, formulario y resumen en dos columnas; conservar botones grandes.
- Validar ergonomía con un teléfono real y guantes. El tamaño visual por sí solo no garantiza uso correcto.

## 3. Datos y reglas invariables

### Catálogo y escenarios

| Empresa | Entrada | Costo USD | Resultados | Despacho | Saldo del producto despachado |
|---|---|---:|---|---|---|
| Rodrigo | Res Entera, 400 kg | 1,200 | Lomo Fino 100; Churrasco 150; Carne para Guiso 100; merma 50 kg | Lomo Fino 30 kg | 70 kg |
| Quality | Cerdo en Canal, 200 kg | 500 | Chuletas de Cerdo 80; Costillas 70; Pierna 30; merma 20 kg | Costillas 40 kg | 30 kg |
| Finilong | Cajas de Lomo Importado Premium, 150 kg | 1,500 | Producto terminado, sin desposte | 50 kg | 100 kg |

Rodrigo: rendimiento 87.5%, merma 12.5%. Quality: rendimiento 90%, merma 10%. Finilong: rendimiento de compra 100%.

El stock final completo debe ser Rodrigo 320 kg, Quality 140 kg y Finilong 100 kg. Total útil restante: 560 kg. Balance global: 750 kg recibidos = 560 kg disponibles + 120 kg despachados + 70 kg de merma.

### Dos puntos de inicio del demo

- **Con recepciones cargadas, predeterminado:** tres lotes iniciales y sus movimientos de recepción. Permite empezar por desposte y despacho.
- **Desde recepción:** catálogo y empresas cargados, inventario vacío. Los formularios ofrecen precargar los valores de cada caso; el operador confirma cada recepción.

Cambiar el modo reinicia el demo tras confirmación. No acumular semillas sobre datos existentes. Reiniciar restaura inventario, movimientos y cola; mantiene la configuración de acceso local.

Los valores de cortes se ofrecen con “Cargar ejemplo”; nunca generan resultados automáticamente. El usuario puede editar y comprobar validaciones.

### Representación y contratos

Guardar peso en gramos enteros y dinero en centavos enteros. Aceptar hasta tres decimales para kg y dos para USD; rechazar precisión adicional. Convertir mediante cadenas decimales, evitando errores de coma flotante en el balance.

```ts
type CompanyId = 'meet' | 'rodrigo' | 'quality' | 'finilong';
type LotStatus = 'available' | 'consumed';
type ProductKind = 'raw' | 'cut' | 'finished';
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; code: string; message: string };
type Lot = {
  id: string;
  companyId: CompanyId;
  warehouseId: 'meet-warehouse';
  productId: string;
  initialGrams: number;
  availableGrams: number;
  status: LotStatus;
  parentLotId?: string;
};
type ReceiptInput = {
  operationId: string;
  companyId: CompanyId;
  productId: string;
  grams: number;
  costCents: number;
};
type SplitInput = {
  operationId: string;
  companyId: CompanyId;
  lotId: string;
  outputs: { productId: string; grams: number }[];
  wasteGrams: number;
};
type DispatchInput = {
  operationId: string;
  companyId: CompanyId;
  lotId: string;
  grams: number;
  customerLabel?: string;
};
```

Operaciones públicas: `receive(input: ReceiptInput): Promise<Result<string>>`, `split(input: SplitInput): Promise<Result<string[]>>` y `dispatch(input: DispatchInput): Promise<Result<string>>`. Los IDs devueltos son el lote creado, los lotes hijos o el movimiento de salida, respectivamente.

Todas validan sesión, empresa activa y propiedad. Un ID de lote ajeno pasado por ruta debe fallar igual que una selección ajena. Los productos del catálogo son compartidos; las existencias pertenecen a empresas.

El cierre de desposte exige suma de cortes más merma igual al saldo del padre. Cortes positivos, merma no negativa, productos compatibles con la materia prima y sin filas duplicadas. Conservar el padre consumido para trazabilidad y ocultarlo de disponibles.

Las salidas exigen peso positivo y menor o igual al disponible. Si el saldo llega a cero, marcar el lote consumido. Repetir un `operationId` devuelve el resultado previo y no modifica datos.

## 4. Estado, persistencia y simulación de red

- `useAppStore`: catálogo, empresas, lotes, movimientos, cola pendiente y operaciones ya aplicadas.
- `useSessionStore`: usuario, empresa activa y acceso bloqueado/desbloqueado.
- `useSyncStore`: conexión simulada, progreso y bloqueo de sincronización. El contador se deriva de la cola, no se mantiene como copia.
- `commands.ts`: único punto de mutación. Valida, calcula una nueva instantánea y persiste antes de publicar éxito.
- `repository.ts`: carga y guarda una instantánea versionada. Serializa comandos para evitar escrituras concurrentes.
- `selectors.ts`: inventario y lotes de producción filtrados por empresa.

Cada movimiento incluye ID, tipo, empresa, fecha, referencias a lotes, pesos y estado de sincronización. El desposte registra relaciones padre/hijos y merma.

La cola y el inventario se guardan en la misma instantánea para evitar movimientos guardados sin su pendiente asociado. Un error de almacenamiento no muestra “Guardado”; mantiene el formulario y permite reintentar.

Al iniciar, esperar la hidratación antes de decidir ruta o cargar semillas. Datos corruptos o versión incompatible muestran recuperación y opción explícita de reiniciar; no borrar datos silenciosamente.

### Offline

1. Sin señal: operación válida actualiza inventario local y agrega un movimiento pendiente.
2. Al recuperar señal: tomar los pendientes y mostrar progreso simulado.
3. Confirmar cada pendiente sin repetir su operación de inventario.
4. Si se pierde señal durante la animación, mantener lo restante pendiente.
5. Nuevos movimientos durante la sincronización se incorporan a la siguiente pasada.
6. Después de reiniciar la app, la cola sigue disponible.

Los temporizadores solo representan el envío. No aplican compras, despostes ni ventas. “Sincronizado” significa confirmación simulada, no comunicación con un servidor.

## 5. Pantallas y recorridos

| Pantalla | Contenido y acción principal | Estados necesarios |
|---|---|---|
| Login | Credenciales demo visibles; email y contraseña; Entrar | Campos inválidos, usuario incorrecto |
| Configurar PIN | Introducir cuatro dígitos y repetir | No coincide, incompleto |
| Desbloquear | Teclado de PIN, usuario y opción de volver al login | PIN incorrecto |
| Recepción | Empresa activa, producto, kg, costo total, costo/kg calculado | Vacío, inválido, guardando, éxito |
| Desposte: lotes | Materias primas disponibles de la empresa | Sin lotes, lote consumido |
| Desposte: captura | Padre, cortes, merma, total, faltante y rendimiento | Falta distribuir, exceso, listo |
| Inventario | Lotes de empresa activa, búsqueda y filtro por tipo | Sin existencias, sin resultados |
| Detalle de lote | Origen, disponible y movimientos | Lote ajeno o inexistente |
| Despacho | Kilos, cliente opcional, saldo previsto y confirmar | Peso inválido, exceso, éxito |
| Panel demo | Simular señal, cola, reiniciar y elegir punto de inicio | Confirmación de reinicio |

Login acepta un usuario fijo de demostración documentado en README; no cualquier contraseña. El PIN debe coincidir en configuración y reingreso. El acceso permanece bloqueado al relanzar. Cerrar sesión conduce al PIN; “Cambiar usuario” vuelve al login. El PIN es exclusivamente de demostración y no debe confundirse con una credencial real.

## 6. Organización de archivos prevista

```text
src/
  app/
    _layout.tsx
    (auth)/login.tsx
    (auth)/setup-pin.tsx
    (auth)/unlock.tsx
    (tabs)/_layout.tsx
    (tabs)/recepcion.tsx
    (tabs)/desposte.tsx
    (tabs)/inventario.tsx
    produccion/[lotId].tsx
    lotes/[lotId].tsx
    despacho/[lotId].tsx
    demo.tsx
  components/
    ui/Button.tsx
    ui/Field.tsx
    ui/NumericKeypad.tsx
    ui/StatusMessage.tsx
    ui/ConfirmSheet.tsx
    layout/Screen.tsx
    layout/CompanyHeader.tsx
    layout/SyncBar.tsx
    inventory/LotRow.tsx
    production/WeightBalance.tsx
  theme/tokens.ts
  domain/types.ts
  domain/weights.ts
  domain/rules.ts
  domain/selectors.ts
  domain/commands.ts
  domain/sync.ts
  mocks/catalog.ts
  mocks/scenarios.ts
  mocks/seedData.ts
  store/useAppStore.ts
  store/useSessionStore.ts
  store/useSyncStore.ts
  storage/repository.ts
tests/
  weights.test.ts
  commands.test.ts
  isolation.test.ts
  persistence.test.ts
  sync.test.ts
  scenarios.test.ts
docs/demo-guide.md
README.md
```

## 7. Secuencia de implementación

### Tarea 1. Unificar documentos y preparar la aplicación

**Archivos:** panorama_general.md, especificaciones_tecnicas.md, package.json, pnpm-lock.yaml, app.json, tsconfig.json, configuración de NativeWind, src/app/_layout.tsx.

- [ ] Reemplazar ejemplos antiguos por referencia al documento de casos.
- [ ] Añadir recepción de producto terminado, balance exacto y separación entre empresa y almacén.
- [ ] Corregir el bloque de código sin cerrar en especificaciones_tecnicas.md.
- [ ] Crear el proyecto Expo en este directorio preservando los documentos.
- [ ] Instalar dependencias compatibles mediante pnpm y herramientas de Expo.
- [ ] Configurar TypeScript estricto, alias, estilos y Expo Router.
- [ ] Añadir scripts start, typecheck, lint y test. Usar un entorno de pruebas compatible con Expo.
- [ ] Abrir en Expo Go y confirmar navegación base y estilos.

**Entrega:** aplicación inicial ejecutable y documentación coherente.

### Tarea 2. Modelo, catálogo y reglas de peso

**Archivos:** domain/types.ts, weights.ts, rules.ts; mocks/catalog.ts, scenarios.ts, seedData.ts; tests/weights.test.ts.

- [ ] Implementar los tipos y contratos del apartado 3.
- [ ] Crear IDs estables para empresas, productos y lotes semilla.
- [ ] Asociar los cortes válidos a Res Entera y Cerdo en Canal.
- [ ] Crear las dos formas de inicio sin duplicar recepciones.
- [ ] Implementar conversión exacta kg/gramos y USD/centavos.
- [ ] Rechazar negativos, vacío, precisión extra, NaN e infinito.
- [ ] Comprobar 0,001 kg = 1 g y balance 0,1 + 0,2 kg = 300 g.

**Entrega:** datos deterministas y cálculos exactos, sin dependencia de pantallas.

### Tarea 3. Comandos y almacenamiento

**Archivos:** domain/commands.ts, selectors.ts, storage/repository.ts, store/useAppStore.ts; tests/commands.test.ts, isolation.test.ts, persistence.test.ts.

- [ ] Implementar receive, split y dispatch con los contratos publicados.
- [ ] Validar propiedad en cada consulta y mutación.
- [ ] Registrar el resultado de operationId para evitar duplicados.
- [ ] Conservar lotes consumidos y vínculos padre/hijos.
- [ ] Persistir estado y pendientes juntos; serializar escrituras.
- [ ] Implementar hidratación, fallo de guardado y recuperación explícita.
- [ ] Verificar rechazo de lote ajeno, exceso, balance incompleto y doble pulsación.
- [ ] Comprobar que un guardado fallido no publica un éxito ni cambia el saldo visible.

**Entrega:** motor funcional que conserva stock y trazabilidad.

### Tarea 4. Sistema visual y estructura de navegación

**Archivos:** theme/tokens.ts; components/ui/*, layout/*; app/(tabs)/_layout.tsx.

- [ ] Implementar tokens propuestos y componentes con estados disabled, loading, error y success.
- [ ] Construir Screen con área segura, desplazamiento y acción inferior.
- [ ] Crear NumericKeypad reutilizable con modo PIN, kg y moneda.
- [ ] Implementar cabecera de empresa y confirmación al descartar formularios.
- [ ] Añadir navegación con icono y texto en las tres pestañas.
- [ ] Revisar ancho pequeño, fuente ampliada y tableta.

**Entrega:** estructura visual navegable, legible y consistente.

### Tarea 5. Login y PIN

**Archivos:** app/(auth)/*, store/useSessionStore.ts, app/_layout.tsx.

- [ ] Definir y documentar credenciales de demostración.
- [ ] Implementar validación de login y configuración doble del PIN.
- [ ] Implementar bloqueo, reingreso y cambio de usuario.
- [ ] Proteger rutas operativas hasta completar hidratación y acceso.
- [ ] Verificar relanzamiento bloqueado, PIN erróneo y recuperación mediante login.

**Entrega:** acceso completo y repetible para la demostración.

### Tarea 6. Recepción

**Archivos:** app/(tabs)/recepcion.tsx; componentes de formulario.

- [ ] Mostrar empresa activa y almacén fijo.
- [ ] Ofrecer precarga de datos de cada caso sin guardar automáticamente.
- [ ] Capturar producto, peso y costo; calcular costo unitario informativo.
- [ ] Mostrar resumen previo y ejecutar receive.
- [ ] Limpiar formulario tras éxito y ofrecer ver lote.
- [ ] Confirmar que producto terminado aparece directamente en inventario.

**Entrega:** las tres recepciones crean existencias correctas.

### Tarea 7. Desposte

**Archivos:** app/(tabs)/desposte.tsx, app/produccion/[lotId].tsx, components/production/WeightBalance.tsx.

- [ ] Listar solo materia prima disponible de la empresa activa.
- [ ] Mostrar campos de cortes compatibles y merma, editables por teclado.
- [ ] Incorporar carga opcional de ejemplo Rodrigo o Quality.
- [ ] Calcular total distribuido, restante, rendimiento y merma en vivo.
- [ ] Mostrar exceso numérico aunque la barra visual se limite al 100%.
- [ ] Habilitar cierre únicamente con balance exacto.
- [ ] Mostrar confirmación y crear hijos mediante split.
- [ ] Verificar padre consumido, hijos correctos y exclusión de Finilong.

**Entrega:** ambos despostes completos y trazables.

### Tarea 8. Inventario y despachos

**Archivos:** app/(tabs)/inventario.tsx, app/lotes/[lotId].tsx, app/despacho/[lotId].tsx, components/inventory/LotRow.tsx.

- [ ] Mostrar existencias por empresa, búsqueda y filtro de producto.
- [ ] Mostrar lote, producto, peso y estado en filas amplias.
- [ ] Abrir detalle con origen e historial.
- [ ] Capturar salida, cliente opcional y saldo previsto.
- [ ] Revalidar saldo al confirmar; aplicar dispatch.
- [ ] Comprobar saldos 70, 30 y 100 kg, además del inventario completo.
- [ ] Cambiar de empresa y verificar filtros, acceso por ID y estados vacíos.

**Entrega:** salidas parciales y aislamiento efectivo en el demo.

### Tarea 9. Simulación offline y controles de demostración

**Archivos:** domain/sync.ts, store/useSyncStore.ts, components/layout/SyncBar.tsx, app/demo.tsx; tests/sync.test.ts.

- [ ] Implementar interruptor de señal y contador derivado de la cola.
- [ ] Guardar movimientos offline y mostrar confirmación “Guardado en este dispositivo”.
- [ ] Procesar confirmaciones simuladas con progreso, sin reaplicar stock.
- [ ] Interrumpir sincronización al perder señal y reanudar pendientes.
- [ ] Añadir reinicio explícito y selección del punto de inicio.
- [ ] Comprobar recarga offline, reconexión repetida y movimientos durante sincronización.

**Entrega:** simulación convincente, recuperable y sin duplicados.

### Tarea 10. Validación integral y entrega

**Archivos:** tests/scenarios.test.ts, docs/demo-guide.md, README.md.

- [ ] Ejecutar pruebas de dominio, aislamiento, persistencia y cola.
- [ ] Ejecutar typecheck, lint y comprobación de compatibilidad de Expo.
- [ ] Recorrer los tres casos desde recepción en Expo Go.
- [ ] Repetir desde las recepciones precargadas.
- [ ] Capturar pantallas de teléfono y tableta; revisar jerarquía, recortes, teclado y contraste.
- [ ] Corregir incidencias detectadas y realizar una segunda revisión acotada.
- [ ] Documentar instalación con pnpm, arranque, credenciales, reinicio y recorrido.
- [ ] Registrar dispositivo usado, verificaciones ejecutadas y limitaciones pendientes.

**Entrega:** demo reproducible con evidencia de los flujos y guía para gerencia.

## 8. Pruebas de aceptación concretas

| Prueba | Resultado esperado |
|---|---|
| Rodrigo: desposte 100 + 150 + 100 + 50 | Tres hijos; padre consumido; 87.5% útil |
| Quality: desposte 80 + 70 + 30 + 20 | Tres hijos; padre consumido; 90% útil |
| Distribución de Rodrigo de 399 kg | Cierre bloqueado, falta 1 kg |
| Distribución de Rodrigo de 401 kg | Cierre bloqueado, excede 1 kg |
| Despachar 101 kg de lote de 100 | Rechazo, saldo intacto |
| Despachar exactamente todo el saldo | Lote consumido, saldo cero |
| Rodrigo consulta o modifica un lote Quality por ID | Rechazo sin revelar detalle |
| Repetir el mismo operationId | Un movimiento y un descuento |
| Finilong abre Desposte | Su producto terminado no aparece |
| Tres movimientos offline y reconexión | Tres confirmaciones; mismos saldos |
| Cerrar y abrir con pendientes | Datos y pendientes conservados |
| Reiniciar demo | Datos iniciales exactos, sin duplicados |
| Recorrido completo | 560 kg disponibles, 120 despachados, 70 de merma |

## 9. Orden de demostración

1. Iniciar sesión y configurar PIN.
2. Mostrar selector de empresas y almacén compartido.
3. Registrar las tres recepciones o explicar el modo precargado.
4. Ejecutar desposte de Rodrigo y despachar 30 kg de Lomo Fino.
5. Ejecutar desposte de Quality, cambiar a Rodrigo y comprobar aislamiento.
6. Volver a Quality y despachar 40 kg de Costillas.
7. Entrar a Finilong, mostrar pase directo y despachar 50 kg.
8. Repetir una operación con señal desactivada; reconectar y observar la cola.
9. Bloquear y reingresar con PIN.
10. Mostrar reinicio para repetir la presentación.

## 10. Condición de finalización

El prototipo se considera listo cuando todos los casos de aceptación pasan, el recorrido funciona en Expo Go y los resultados persisten correctamente. La revisión visual debe confirmar uso legible en los dispositivos evaluados. Todo control visible debe ejecutar su acción o explicar por qué está deshabilitado.

## 11. Estado de ejecución

- Implementado el prototipo Expo con acceso por correo/PIN, selección de empresa, recepción, desposte completo, inventario, despachos, aislamiento de datos por empresa, persistencia local, simulación offline y reinicio de demo.
- Incorporados los tres lotes y recorridos canónicos de `casos_de_uso_flujos_simulados.md`.
- Añadida guía de demostración en `docs/demo-guide.md` e instrucciones de arranque y credenciales en `README.md`.
- Verificados: pruebas de dominio, `pnpm typecheck`, `pnpm lint`, verificación de dependencias Expo y exportación web estática.
- Limitación: no se hizo recorrido visual con Expo Go en teléfono o tableta; la validación visual en dispositivo físico queda pendiente.
- El directorio no es un repositorio Git, por lo que no se generó commit ni rama de trabajo.

