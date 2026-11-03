# Datos de demostración

Carga real del agente el 2026-11-02: `npm run seed`, base `data/reservas.sqlite`, inicialmente con cero reservas. Fecha elegida: **2026-11-03**, hora argentina UTC-03:00. Solicitantes ficticios con prefijo `[DEMO]`.

| ID local | Unidad | Solicitante | Inicio–fin | Estado |
| --- | --- | --- | --- | --- |
| 1 | MIC-01 | Grupo Alfa | 10:00–11:00 | ACTIVA |
| 2 | MIC-01 | Grupo Beta | 11:00–12:00 | ACTIVA |
| 3 | MIC-02 | Grupo Gamma | 10:00–11:00 | ACTIVA |
| 4 | OSC-01 | Grupo Delta | 09:00–10:00 | CANCELADA |
| 5 | MUL-01 | Grupo Epsilon | 14:00–15:00 | ACTIVA |
| 6 | FUE-01 | Grupo Zeta | 19:45–20:00 | ACTIVA |
| 7 | MIC-02 | Grupo Eta | 15:00–16:00 | CANCELADA |
| 8 | MIC-02 | Grupo Theta | 15:00–16:00 | ACTIVA |

La base permanece local y excluida de Git; el comando y esta guía permiten reproducir la carga en otra instalación. Los ID y la fecha pueden ser distintos allí. El comando usa mañana en Argentina y busca un día sin conflictos; si ya existe cualquier registro con prefijo `[DEMO]`, no agrega más. Las reservas se conservan con el paso de los días. No se renuevan ni se eliminan al iniciar. Si la ejecución se interrumpe, revisar los registros y el error antes de repetir: la carga completa no es una única transacción.

## Prueba manual con los datos cargados

Abrir http://localhost:3000 y actualizar el historial. Elegir la fecha de la tabla:

1. Consultar MIC-01 10:30–11:30: ocupado. Intentar reservar: debe rechazar sin insertar.
2. Consultar MIC-01 12:00–13:00: libre; los dos registros existentes demuestran límites consecutivos a las 11:00.
3. Comparar MIC-01 y MIC-02 a las 10:00: ambas tienen reservas válidas simultáneas.
4. Consultar OSC-01 09:00–10:00: libre aunque el registro cancelado sigue visible.
5. Consultar MIC-02 15:00–16:00: ocupado por Theta; Eta sigue cancelada con otro ID y los mismos horarios.
6. Filtrar activas/canceladas y buscar `[DEMO]`, una unidad o un ID.
7. Reiniciar con `npm start` sin cambiar la base: deben conservarse ID, datos y estados.

Las consultas ya fueron comprobadas por HTTP por el agente. Este procedimiento visual y la aceptación humana siguen pendientes. Una vez pasada la fecha de los ejemplos, la validación rechaza consultar/reservar esos intervalos históricos; el historial y las cancelaciones siguen accesibles. Las pruebas automáticas usan relojes controlados y bases temporales independientes, no dependen de estas ocho filas.
