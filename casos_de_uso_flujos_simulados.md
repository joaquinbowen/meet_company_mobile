# Casos de Uso y Flujos de Datos Simulados

Este documento define los tres flujos operativos que debe simular el prototipo. Los lotes pertenecen lógicamente a cada empresa y se almacenan físicamente en Meet Company. El estado inicial debe permitir ejecutar cada caso; al procesar o despachar, las existencias se actualizan en memoria.

## Reglas comunes

- Empresas propietarias: Rodrigo, Quality y Finilong. Meet Company es el almacén físico para los tres casos.
- El inventario, los productos disponibles y las opciones de despacho se filtran por empresa propietaria activa. Una empresa no puede ver ni operar sobre los lotes de otra.
- Cada lote debe identificar como mínimo: ID, empresa propietaria, producto, categoría (materia prima o producto terminado/corte), peso inicial, peso disponible y almacén físico.
- Registrar una recepción crea un lote. Procesar materia prima consume el lote padre y crea lotes hijos útiles; la merma se registra como salida del proceso y no como producto disponible para venta, salvo que el prototipo decida modelarla expresamente.
- Un despacho reduce el peso disponible del lote elegido. No se puede despachar más de lo disponible.
- Los costos son datos simulados para mostrar la recepción y calcular el costo unitario. Moneda indicada en los casos: dólares (USD).

---

## Caso 1: Desposte completo — Rodrigo

**Objetivo:** demostrar la recepción de materia prima, el desposte con balance exacto, el rendimiento y la salida parcial de un corte.

### Recepción

- Empresa propietaria: Rodrigo.
- Producto: Res Entera (materia prima).
- Cantidad: 400 kg.
- Costo total: $1,200 USD ($3.00/kg).
- Almacén físico: Meet Company, asignado automáticamente.
- Resultado: un lote de materia prima de 400 kg en el inventario de Rodrigo.

### Desposte

Al procesar el lote de 400 kg se registran estos resultados:

| Producto resultante | Peso |
|---|---:|
| Lomo Fino | 100 kg |
| Churrasco | 150 kg |
| Carne para Guiso | 100 kg |
| Merma (hueso/cebo) | 50 kg |
| **Total distribuido** | **400 kg** |

- Validar que la suma de los resultados sea exactamente 400 kg para cerrar el desposte; impedir que supere el peso disponible.
- Rendimiento útil: 350 / 400 = **87.5%**.
- Merma: 50 / 400 = **12.5%**.
- Al cerrar, consumir o cerrar el lote padre y crear tres lotes disponibles para venta a nombre de Rodrigo. Registrar además los 50 kg de merma para mantener trazabilidad, sin agregarlos al inventario vendible.

### Salida

- Empresa activa: Rodrigo.
- Producto/lote: Lomo Fino, 100 kg.
- Despacho: 30 kg.
- Stock esperado: **70 kg** de Lomo Fino de Rodrigo.

---

## Caso 2: Procesamiento y privacidad — Quality

**Objetivo:** demostrar el desposte de otra empresa y comprobar que el inventario queda aislado por propiedad lógica.

### Recepción

- Empresa propietaria: Quality.
- Producto: Cerdo en Canal (materia prima).
- Cantidad: 200 kg.
- Costo total: $500 USD ($2.50/kg).
- Almacén físico: Meet Company, asignado automáticamente.
- Resultado: un lote de materia prima de 200 kg en el inventario de Quality.

### Desposte

Al procesar el lote de 200 kg se registran estos resultados:

| Producto resultante | Peso |
|---|---:|
| Chuletas de Cerdo | 80 kg |
| Costillas | 70 kg |
| Pierna | 30 kg |
| Merma | 20 kg |
| **Total distribuido** | **200 kg** |

- Validar el balance exacto de 200 kg.
- Al cerrar, consumir o cerrar el lote padre y crear los lotes de Chuletas, Costillas y Pierna bajo la propiedad de Quality. Registrar la merma fuera del inventario vendible.

### Privacidad y salida

- Con la empresa activa Rodrigo, las Chuletas y Costillas de Quality no deben aparecer ni permitir operaciones.
- Volver a Quality y despachar 40 kg del lote de Costillas de 70 kg.
- Stock esperado: **30 kg** de Costillas de Quality.

---

## Caso 3: Pase directo sin transformación — Finilong

**Objetivo:** demostrar la compra de producto terminado que pasa directamente a venta sin entrar al módulo de desposte.

### Recepción de producto terminado

- Empresa propietaria: Finilong.
- Producto: Cajas de Lomo Importado Premium (producto terminado).
- Cantidad: 150 kg.
- Costo total: $1,500 USD ($10.00/kg).
- Almacén físico: Meet Company, asignado automáticamente.
- Resultado: un lote de producto terminado de 150 kg en el inventario disponible de Finilong.

### Producción omitida

- Este producto no aparece como pendiente de desposte.
- Rendimiento de compra: 100%; no se genera merma operativa.

### Inventario y salida

- Empresa activa: Finilong.
- Mostrar los 150 kg de Lomo Importado Premium listos para despacho.
- Despachar 50 kg al cliente VIP.
- Stock esperado: **100 kg** de Finilong.

---

## Criterios de aceptación del demo

1. Se pueden registrar las tres recepciones con su empresa, producto, peso y costo.
2. Los dos lotes de materia prima permiten capturar sus distribuciones y solo se cierran cuando la suma coincide con el peso disponible.
3. El lote de producto terminado de Finilong aparece disponible para venta sin pasar por desposte.
4. Los tres casos conservan la propiedad de empresa a través de recepción, transformación e inventario.
5. Cambiar la empresa activa filtra todo el inventario y las operaciones; no se muestran lotes de otras empresas.
6. Los despachos dejan exactamente los stocks finales descritos: Rodrigo 70 kg de Lomo Fino, Quality 30 kg de Costillas y Finilong 100 kg de Lomo Importado Premium.

