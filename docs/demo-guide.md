# Guía de demostración

## Preparar

1. Ejecuta `pnpm install` y `pnpm start`; abre el QR con Expo Go.
2. Inicia sesión con `operador@meetcompany.demo` y `planta2026`.
3. Configura el PIN de cuatro dígitos y confirma.
4. Entras a Inicio como operador de la planta Meet Company. En “Mercadería de”, elige al propietario: esto filtra los módulos y no cambia tu usuario.
5. Abre “Controles de demostración”. El estado precargado contiene Rodrigo, Quality y Finilong. Usa “Empezar con inventario vacío” si vas a mostrar las tres recepciones.

## Flujo Rodrigo

1. En Recepción, “Caso 1 · Rodrigo” carga Res Entera, 400 kg y $1,200. Confirma el ingreso.
2. En Desposte, abre el lote y pulsa “Cargar caso”. Deben aparecer Lomo Fino 100, Churrasco 150, Carne para Guiso 100 y merma 50 kg.
3. La suma debe quedar en 400 kg, rendimiento 87.5% y merma 12.5%. Cambia un peso para ver que el cierre queda bloqueado.
4. Confirma el desposte. Los cortes aparecen en Inventario y la merma queda en el historial.
5. En el módulo Despachos, abre Lomo Fino y despacha 30 kg y comprueba el saldo de 70 kg.

## Flujo Quality y aislamiento

1. En Recepción, carga “Caso 2 · Quality” y confirma Cerdo en Canal, 200 kg, $500.
2. Desposta con Chuletas 80, Costillas 70, Pierna 30 y merma 20 kg.
3. Cambia “Mercadería de” a Rodrigo. Las existencias de Quality no deben aparecer.
4. Vuelve a Quality, abre Costillas y despacha 40 kg. Deben quedar 30 kg.

## Flujo Finilong

1. En Recepción, carga “Caso 3 · Finilong” y confirma Cajas de Lomo Importado Premium, 150 kg, $1,500.
2. Comprueba que el lote aparece listo para venta y no entra a Desposte.
3. Despacha 50 kg al Cliente VIP. El saldo esperado es 100 kg.

## Modo offline y cierre

1. Toca “Simular corte” en la barra de conexión.
2. Registra una recepción o salida válida. Debe guardarse localmente y sumar un pendiente.
3. Toca “Recuperar señal”. La barra muestra sincronización y luego cero pendientes. El stock no cambia por la confirmación simulada.
4. Bloquea con PIN desde controles de demo y vuelve a entrar.

Si se completa todo desde cero, deben quedar 560 kg útiles disponibles, 120 kg despachados y 70 kg registrados como merma. Reiniciar los casos precargados restaura el inventario inicial y permite repetir la demo.

## Módulos y perfiles

Inicio reúne Recepción, Producción / Desposte, Inventario, Despachos y Trazabilidad. La barra inferior permite volver a Inicio desde cualquier módulo. Trazabilidad incluye los lotes agotados y permite abrir el lote padre y los cortes derivados.

La planta y el almacén físico son siempre Meet Company. Rodrigo, Quality y Finilong identifican propietarios, no perfiles ni plantas. Meet Company también puede ser propietario de mercadería propia; no tiene lotes propios precargados en estos tres casos.

La app utiliza un único operador de demostración que puede trabajar por propietario. Los listados y las operaciones siguen separados por el propietario seleccionado. Inicio muestra además el total físico de la planta, identificado como consolidado.

Los perfiles administrativos se presentan en la web: gerencia ve el conjunto, el jefe de almacén revisa el volumen físico y cada administrador de empresa consulta su empresa. No hay un cambio de perfil al elegir un propietario en la app. La web tiene sus propios datos simulados y no recibe los cambios de la app.

Para ejecutar todos los pasos desde recepción, primero vacía el inventario en los controles de demostración. Si utilizas recepciones precargadas, omite la compra para no duplicarla. Al terminar, abre Trazabilidad para consultar el historial.