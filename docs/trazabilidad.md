# Matriz de trazabilidad y cobertura

Relaciona la [especificación](especificacion.md) con código y verificaciones existentes. No agrega pruebas ficticias ni convierte inspección de código en prueba ejecutada.

## 1. Catálogo de pruebas

Los identificadores T01–T16 son referencias documentales. Los nombres entre comillas corresponden a los archivos; tres títulos conservan signos `?` de una codificación anterior para que puedan localizarse exactamente.

| ID | Archivo | Nombre exacto de la prueba |
| --- | --- | --- |
| T01 | [reservations.test.ts](../tests/reservations.test.ts) | creación válida, solicitante normalizado e identificador |
| T02 | mismo archivo | rechaza toda superposición activa y disponibilidad coincide |
| T03 | mismo archivo | permite límites consecutivos en ambos extremos |
| T04 | mismo archivo | permite unidades distintas en el mismo horario |
| T05 | mismo archivo | valida unidad, solicitante, fechas inexistentes, formato y orden |
| T06 | mismo archivo | valida calendario y años bisiestos sin depender de la zona del host |
| T07 | mismo archivo | cancelación conserva todos los datos y libera el intervalo; repetir es idempotente |
| T08 | mismo archivo | rechaza horarios pasados hoy y d?as anteriores usando hora argentina |
| T09 | mismo archivo | respeta segundos transcurridos y cambio de d?a argentino |
| T10 | mismo archivo | acepta apertura 06:00, cierre 20:00 y ?ltimo turno 19:45 |
| T11 | mismo archivo | rechaza fuera de horario, minutos intermedios y reservas nocturnas en ambas operaciones |
| T12 | mismo archivo | selector ofrece cuartos de hora y sugiere un intervalo futuro dentro de horario |
| T13 | mismo archivo | API: inventario, entradas inválidas, conflicto concurrente y cancelación |
| T14 | mismo archivo | persistencia real entre procesos: conserva activa/cancelada y disponibilidad |
| T15 | [demo.test.ts](../tests/demo.test.ts) | ejemplos cubren conflictos, consecutivos, cancelación y reutilización sin duplicarse |
| T16 | mismo archivo | carga elige otra fecha si hay conflictos y conserva exactamente los registros anteriores |

Resultado registrado: 16 aprobadas, cero fallos. T13 comprueba dos solicitudes HTTP concurrentes; T14 usa procesos independientes y una base temporal. No se afirma concurrencia distribuida ni una prueba de carga de producción.

## 2. Requisito → implementación → aceptación

| Requisito | Implementación | Criterios | Prueba / tipo de evidencia |
| --- | --- | --- | --- |
| RF-01 / R1 | [shared/types.ts](../shared/types.ts), ruta inventory en [app.ts](../server/app.ts). | CA-01 | T13 verifica cantidad cinco; IDs/nombres por inspección. Comprobación HTTP adicional de cinco ID exactos en [evidencia API](evidencia/api-documentada.json). |
| RF-02 / R1 | `Store.availability` en [store.ts](../server/store.ts), ruta availability. | CA-03, CA-04, CA-07 | T02, T05, T07–T11, T13–T15. |
| RF-03 / R2 | `Store.create`, `validateRequester` y `validateInterval`. | CA-02 | T01; creación vía API en T13. |
| RF-04 / R3 | [domain.ts](../server/domain.ts), validación de cuerpo JSON y errores en app.ts. | CA-05, CA-10 | T05, T06, T08–T13. |
| RF-05 / R4, R5 | SQL de conflictos y transacción de create. | CA-03, CA-04, CA-07 | T02–T04, T13, T15. |
| RF-06 / R6 | `Store.cancel`, ruta cancel, diálogo en [main.tsx](../src/main.tsx). | CA-06 | T07 y T13 para dominio/API; diálogo inspeccionado, recorrido visual no completado. |
| RF-07 / R6, R7 | `Store.list`, ruta reservations e historial React. | CA-06, CA-08 | T07, T13, T14 para filas/estados; orden SQL, búsqueda y filtros por inspección. |
| RF-08 / R7 | DatabaseSync y ruta persistente de [index.ts](../server/index.ts). | CA-08 | T14 escribe y lee activa/cancelada en dos procesos reales. |
| RF-09 / R8 | [package.json](../package.json), index.ts y estáticos en app.ts. | CA-09, CA-10 | npm start y HTTP 200 registrados; T12 solo funciones de selección. |
| RF-10 | [demo.ts](../server/demo.ts), [seed.ts](../server/seed.ts). | CA-11 | T15/T16; comando ejecutado dos veces sin duplicación. |

CA-01 expresa el resultado requerido de inventario completo; la prueba de la suite cuenta cinco unidades. Durante la ampliación se ejecutó además una comprobación HTTP con aserción de los cinco ID exactos, cuyos resultados están en evidencia/api-documentada.json. No se presenta esa comprobación adicional como una aserción ya existente dentro de T13.

## 3. Reglas → evidencia

| Reglas | Evidencia |
| --- | --- |
| RN-01, RN-02 | T01 y T05: unidad desconocida, solicitante vacío/espacios/no string/extenso y normalización. |
| RN-03 | T05/T06: formato, calendario, años bisiestos y zona explícita. Límites de año por inspección y año menor a 1900 probado. |
| RN-04 | T05 para orden; T11 para cambio de fecha. |
| RN-05 | T10/T11 y T12: extremos, fuera de ventana, cuartos y selector. |
| RN-06 | T08/T09: pasado hoy/antes, segundos y diferencia entre día UTC y argentino. |
| RN-07–RN-10 | T02–T04, T07, T11, T13–T15; SQL compartido inspeccionado. |
| RN-11, RN-12 | T07: conservación de todos los datos, reintento, ID inválido e inexistente. Cancelación histórica permitida por inspección: cancel no aplica validación temporal. |

## 4. Evidencia humana y versiones

| Evidencia | Qué acredita | Versión / registro |
| --- | --- | --- |
| Corrección humana de episodio 1 | Cambio solicitado de reglas iniciales. | Registro narrativo en [episodios](episodios.md); sin commit original recuperado. |
| Aceptación del episodio 2 | Decisión del autor y motivo de realismo/integridad. | Estado corregido en `0a27447`; aceptación registrada en `7b5762f`. |
| Aceptación del episodio 3 | Decisión del autor y motivo de disponer de datos para pruebas. | Implementación `6fa2060`; aceptación `7b5762f`. |
| Reproducción limpia del agente | Instalación, 16 pruebas y build sin dependencias/base copiadas. | Clon de `6fa2060`; resultados en [verificación](verificacion.md). |
| Publicación | Historial remoto y acceso público comprobados. | `d3fe218` documenta la operación; rama master. |

## 5. Límites de cobertura

No hay suite de navegador ni certificación de accesibilidad. Búsqueda, filtros, confirmación visual y orden de tabla están implementados y revisados en código; no se declara un recorrido visual automatizado exitoso. El autor aceptó resultados, pero no informó haber ejecutado la guía manual completa.

No se realizaron pruebas de carga, concurrencia distribuida, fallo de disco, recuperación ante corrupción ni atomicidad de la carga demo. La carga demo puede quedar parcial si se interrumpe. Las verificaciones de persistencia usan SQLite real y procesos independientes.

Esto separa las reglas verificadas automáticamente de la funcionalidad inspeccionada y de los procedimientos pendientes, sin convertir la cantidad de pruebas en cobertura total.
