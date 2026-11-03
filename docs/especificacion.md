# Especificación de requisitos

**Proyecto:** sistema local de reservas de equipos. **Autor:** Nahuel Peralta. **Fecha de documentación:** 2026-11-02. Describe el comportamiento implementado y las decisiones humanas registradas. No representa una especificación anterior recuperada retrospectivamente.

## 1. Necesidad y alcance

La coordinación del laboratorio necesita reemplazar el control mediante mensajes y planillas para evitar reservas superpuestas y cancelaciones que sigan bloqueando horarios. La solución permite consultar, reservar, cancelar y conservar historial en una computadora local.

Actor: operador del laboratorio, sin autenticación ni verificación de identidad. El solicitante de cada reserva es ficticio. No hay roles ni cuentas reales.

Incluido: inventario fijo, disponibilidad por unidad/intervalo, creación identificable, cancelación, historial, SQLite, interfaz web local y carga explícita de ejemplos. Fuera de alcance: edición de inventario/reservas, reactivación, pagos, notificaciones, integraciones de negocio, despliegue y concurrencia distribuida.

## 2. Inventario

Fuente única: [shared/types.ts](../shared/types.ts). Cada identificador representa una unidad independiente.

| Unidad | Equipo |
| --- | --- |
| MIC-01 | Microscopio digital |
| MIC-02 | Microscopio digital |
| OSC-01 | Osciloscopio |
| MUL-01 | Multímetro |
| FUE-01 | Fuente de alimentación |

## 3. Requisitos funcionales

Se conservan las referencias históricas R1–R8. Este desglose RF documenta con más detalle la misma implementación, más la carga demo del episodio 3.

| ID | Entrada o acción | Comportamiento esperado | Referencia |
| --- | --- | --- | --- |
| RF-01 | Abrir inventario / GET inventory. | Mostrar las cinco unidades con ID, nombre, categoría y símbolo. No ofrecer administración. | R1 |
| RF-02 | Unidad, inicio y fin válidos. | Informar disponible/ocupada y reservas activas en conflicto, sin modificar datos. | R1, R4, R5 |
| RF-03 | Unidad, solicitante e intervalo válidos, sin conflicto. | Insertar ACTIVA y devolver ID, unidad, solicitante normalizado, inicio y fin. | R2 |
| RF-04 | Entrada que incumpla validación. | Rechazar con motivo y sin insertar. API 400 por datos y 409 por conflicto. | R3 |
| RF-05 | Crear o consultar un intervalo. | Aplicar conflicto de activas de la misma unidad; permitir consecutivos y distintas unidades simultáneas. | R4, R5 |
| RF-06 | Cancelar un ID existente. | Cambiar únicamente estado a CANCELADA, mantener registro e ID y liberar el horario. Repetir devuelve el mismo estado. | R6 |
| RF-07 | Consultar historial. | Devolver todas las reservas por inicio descendente e ID descendente; la web filtra por estado y busca ID, unidad o solicitante. | R6, R7 |
| RF-08 | Cerrar y abrir otro proceso con la misma base. | Recuperar reservas activas/canceladas con los mismos datos y disponibilidad. | R7 |
| RF-09 | Ejecutar npm start. | Comprobar tipos, compilar interfaz y servir API/archivos en un único puerto local. | R8 |
| RF-10 | Ejecutar npm run seed. | Agregar ocho ejemplos ficticios si no hay registros [DEMO]; preservar previos y no repetir la carga existente. | Episodio 3 |

## 4. Reglas de negocio

| ID | Regla precisa | Aplicación |
| --- | --- | --- |
| RN-01 | Unidad exacta del inventario; `mic-01` no equivale a `MIC-01`. | Consulta y creación. |
| RN-02 | Solicitante string, trim no vacío, longitud normalizada ≤120. | Creación. |
| RN-03 | String `AAAA-MM-DDTHH:mm`, calendario real, 1900≤año≤9999; no `Z`, offset ni segundos. | Consulta y creación. |
| RN-04 | Inicio < fin y misma fecha local argentina. | Consulta y creación. |
| RN-05 | Ambos extremos entre 06:00 y 20:00; minutos múltiplos de 15. | Consulta y creación. |
| RN-06 | Inicio ≥ instante actual del servidor. La precisión de entrada es de minutos, pero la comparación considera segundos/milisegundos actuales. | Consulta y creación. |
| RN-07 | Intervalo `[inicio, fin)`; CANCELADA nunca bloquea. | Conflictos. |
| RN-08 | Conflicto si misma unidad, ACTIVA, `start < fin_nuevo` y `end > inicio_nuevo`. | Conflictos. |
| RN-09 | Un fin igual a otro inicio no se superpone. Distintas unidades no se bloquean mutuamente. | Consulta y creación. |
| RN-10 | La misma `validateInterval` y la misma consulta `Store.availability` participan en ambas operaciones. La aceptación de una creación exige además solicitante válido y revalidación al escribir. | Consistencia. |
| RN-11 | Cancelar modifica solo status. Puede cancelarse una reserva histórica; no se borran filas ni se cambia el intervalo. | Cancelación. |
| RN-12 | ID decimal positivo seguro; mal formado →400, inexistente →404, ya CANCELADA →200 sin cambio adicional. | Cancelación. |

La disponibilidad no exige solicitante: informa sobre la unidad y el intervalo. Estar libre no garantiza una creación posterior si otro pedido ocupa el turno o el inicio pasa antes del envío; al crear se vuelve a validar.

## 5. Supuestos y restricciones técnicas

| ID | Supuesto / límite |
| --- | --- |
| S-01 | Toda entrada se interpreta como UTC-03:00 fijo, sin usar la zona del equipo. |
| S-02 | Se guardan instantes UTC en milisegundos; se muestran con America/Argentina/Buenos_Aires. |
| S-03 | Mínimo 15 minutos, máximo 14 horas dentro de la jornada; sin límite adicional de anticipación dentro de los años admitidos. |
| S-04 | Reloj real del servidor, inyectable en Store para las pruebas. No hay cambio de reloj mediante API. |
| S-05 | ID entero autoincremental no eliminado al cancelar. ACTIVA expresa ausencia de cancelación, no necesariamente un turno futuro. |
| S-06 | Archivo SQLite local; validación/conflicto/inserción protegidos por BEGIN IMMEDIATE. Sin distribución entre equipos. |
| S-07 | Arranque no destructivo. Otra ruta de base permite datos vacíos sin borrar la anterior. |
| S-08 | Estado “Libre ahora” orientativo. La interfaz actualiza su reloj y cada operación consulta al servidor. |

No se promete seguridad multiusuario, copias automáticas, paginación ni servicio externo. Las validaciones de unidad/solicitante/horarios están en el código de aplicación; el esquema SQLite no reproduce todas esas restricciones.

## 6. Casos de uso

| Caso | Precondición | Flujo y resultado | Alternativa |
| --- | --- | --- | --- |
| CU-01 Consultar | Aplicación iniciada. | Seleccionar unidad/fecha/horas; consultar; mostrar disponibilidad y conflictos. | Datos inválidos: mostrar motivo, sin escritura. |
| CU-02 Reservar | Intervalo y solicitante válidos. | Enviar; servidor valida, bloquea escritura, revisa conflicto e inserta; refrescar historial. | Conflicto o validación: rechazar sin insertar. |
| CU-03 Cancelar | Registro existente. | Seleccionar Cancelar; confirmar; actualizar estado y conservar fila. | Volver cierra el diálogo sin enviar; ID inexistente por API devuelve 404. |
| CU-04 Historial | Aplicación iniciada. | Listar activas/canceladas; buscar o filtrar en la interfaz. | Sin filas/coincidencias: mensaje de estado vacío. |
| CU-05 Recuperar | Misma ruta SQLite después del cierre. | Reiniciar; recuperar registros y estados. | Ruta distinta selecciona otra base, no migra ni elimina la anterior. |

## 7. Criterios de aceptación

| ID | Dado / cuando / entonces | Requisito |
| --- | --- | --- |
| CA-01 | Consultar inventario → exactamente cinco ID de §2. | RF-01 |
| CA-02 | Sin conflicto, entrada válida → nuevo ID, ACTIVA y campos correctos. | RF-03 |
| CA-03 | MIC-01 10–11 activa → rechazar 10:30–11:30, 09:30–10:30, 10:15–10:45, 09–12 y 10–11; no insertar. | RF-04, RF-05 |
| CA-04 | Misma base → aceptar MIC-01 09–10 y 11–12, y MIC-02 10–11. | RF-05 |
| CA-05 | Entradas inválidas o fuera de las reglas temporales → rechazo sin crear. | RF-04 |
| CA-06 | Cancelar → mismos ID/datos, CANCELADA, intervalo disponible y nueva reserva permitida; repetir idempotente. | RF-06, RF-07 |
| CA-07 | Para datos de intervalo equivalentes, consulta/creación aplican las mismas validaciones y conflictos. | RF-02, RF-04, RF-05 |
| CA-08 | Un proceso guarda activa/cancelada; otro las lee → persisten datos/estados y disponibilidad correcta. | RF-08 |
| CA-09 | npm start → tipos/build correctos y web/API en puerto local único. | RF-09 |
| CA-10 | Funciones del selector → 06–20 en cuartos, último inicio 19:45 e intervalo inicial futuro. | RF-04, RF-09 |
| CA-11 | Carga nueva → ocho filas, seis activas/dos canceladas; repetir → cero nuevas, sin modificar previas. | RF-10 |

Fechas futuras de 2099 en pruebas generales; reloj controlado para escenarios de pasado y carga demo. La relación con nombres exactos de pruebas y límites de cobertura está en [trazabilidad.md](trazabilidad.md). No se presenta como comprobada una interacción visual que solo fue inspeccionada en código.

## 8. Modelo persistente y estados

Esquema de [server/store.ts](../server/store.ts):

```sql
CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  unit TEXT NOT NULL,
  requester TEXT NOT NULL,
  start INTEGER NOT NULL,
  end INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('ACTIVA','CANCELADA')),
  CHECK(start < end)
);
CREATE INDEX IF NOT EXISTS reservations_interval
  ON reservations(unit, status, start, end);
```

Transiciones: crear → ACTIVA; cancelar ACTIVA → CANCELADA; cancelar CANCELADA → CANCELADA. No hay borrado ni reactivación. No existen campos creada_en/cancelada_en: la conservación se verifica comparando los datos originales y el estado final.

Consulta de conflictos compartida:

```sql
SELECT * FROM reservations
WHERE unit=? AND status='ACTIVA' AND start < ? AND end > ?
ORDER BY start;
```

Los parámetros son unidad, fin nuevo e inicio nuevo. Consulta no modifica datos. Creación la ejecuta dentro de la transacción de escritura antes de insertar.

## 9. Requisitos de calidad y verificación

- Reproducibilidad: instalación con lockfile, sin cuenta de IA; tipos y build ejecutables.
- Persistencia: activas/canceladas recuperables en otro proceso; arranque no destructivo.
- Integridad: mismas reglas de intervalo y consulta de conflictos; parámetros SQL y transacción de creación.
- Comprensibilidad: mensajes en español, IDs visibles, estado vacío y confirmación de cancelación.
- Trazabilidad: documentación versionada, decisiones humanas separadas de verificaciones del agente.

No se declara una certificación de accesibilidad ni mediciones de rendimiento; no se realizaron esas evaluaciones.

## 10. Evolución y relación con referencias

La consigna establece las reglas mínimas. El autor agregó la jornada 06–20, cuartos de hora y rechazo de pasado; luego pidió datos para probar y esta ampliación documental. RF/RN/S/CA hacen explícito lo implementado, sin agregar reglas de los otros proyectos.

`0a27447` captura el estado ya corregido; `6fa2060` agrega demo; `7b5762f` registra autor/aceptación y `d3fe218` la publicación. La implementación previa a los horarios no se recuperó en Git. Esta especificación se agrega por el pedido de similitud documental y no se fecha como anterior.

Enlaces: [README](../README.md), [decisiones](decisiones.md), [episodios](episodios.md), [trazabilidad](trazabilidad.md), [API](api.md), [verificación](verificacion.md).
