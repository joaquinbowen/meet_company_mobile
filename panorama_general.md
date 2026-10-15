# Panorama General: Prototipo Funcional UI/UX (Grupo Rodrigo)

## 1. Propósito del Sistema
Desarrollar un prototipo interactivo (Mockup Funcional) de la aplicación móvil para cuartos fríos del Grupo Rodrigo. El objetivo es validar con gerencia (Celedonio Huamán) la experiencia de usuario, los flujos operativos y la lógica de separación de empresas, sin depender de un backend ni bases de datos reales en esta fase.

## 2. Lógica de Negocio Simulada (Multi-Tenant Lógico)
- **Almacén Físico Único:** Físicamente todo ocurre en "Meet Company".
- **Propiedad Lógica:** Las existencias simuladas pertenecerán a una de las cuatro empresas (Meet, Rodrigo, Quality, Finilong).
- **Regla Estricta UI:** Si el usuario elige operar como "Rodrigo", las listas de inventario y opciones de venta ocultarán mediante filtros en memoria cualquier lote que no pertenezca a "Rodrigo".

## 3. Flujos Operativos a Demostrar

### A. Autenticación Simulada
- Pantalla de Login inicial con las credenciales de demostración documentadas en `README.md`.
- Configuración de un PIN de 4 dígitos.
- Cierre de sesión y reingreso rápido usando únicamente el teclado numérico del PIN.

### B. Módulo de Recepción (Compras)
- Formulario para registrar materia prima o producto terminado, empresa, peso y costo total.
- El almacén físico se asigna a Meet Company.
- El flujo principal y los datos iniciales están definidos en `casos_de_uso_flujos_simulados.md`.
- Al guardar, el inventario local se actualiza; sin señal, queda un movimiento pendiente.

### C. Módulo de Desposte / Producción (Core del Demo)
- Procesar los lotes de Rodrigo (400 kg) y Quality (200 kg) con las distribuciones indicadas en los casos de uso.
- No permitir cerrar si cortes más merma no suman exactamente el peso disponible.
- Mostrar progreso, kilos pendientes o excedidos, rendimiento y porcentaje de merma.
- Consumir el lote padre y crear lotes hijos útiles bajo la misma empresa.
- Finilong compra un producto terminado y omite el desposte.

### D. Módulo de Salidas (Despachos/Ventas)
- Pantalla que lista el inventario disponible.
- Demostrar que al cambiar de empresa (ej. de Rodrigo a Quality), la lista cambia.
- Despacho de un producto, restando el peso del estado global.

### E. Simulación Offline (Efecto "Wow" para el cliente)
- La UI contará con un "Sync Bar" falso (Online / Offline).
- Botón en la interfaz de "Simular pérdida de señal".
- Al guardar acciones en estado "Offline", se acumulan en un contador de "Movimientos pendientes".
- Al devolver la señal, el contador baja a cero con una animación de "Sincronizando...".

## Navegación operativa y contexto de propietario

El usuario de la demo es un operador de la planta Meet Company. La cabecera distingue planta física, perfil y propietario seleccionado. “Mercadería de” cambia el contexto de trabajo, no la identidad del usuario. Los módulos filtran los lotes de ese propietario y las recepciones se registran a su nombre.

Inicio ofrece acceso a Recepción, Producción / Desposte, Inventario, Despachos y Trazabilidad, con una guía del flujo y de los perfiles. El resumen físico muestra los kilos disponibles de todos los propietarios en Meet Company y, por separado, los del propietario seleccionado. Los lotes agotados siguen accesibles desde Trazabilidad, con vínculos al lote de origen y a sus cortes.

Los perfiles de gerencia, administrador de empresa y jefe de almacén corresponden a las vistas administrativas de la web. No son nombres de empresas ni opciones del selector de propietario móvil.