# API local y ejemplos reproducibles

Base predeterminada: `http://localhost:3000/api`. Arranque desde la raíz: `npm start`. Solo escucha en `127.0.0.1`; no hay autenticación ni servicios externos de negocio.

## 1. Contratos

| Operación | Solicitud | Éxito |
| --- | --- | --- |
| Inventario | GET `/inventory` | 200, array de `{ id, name, category, symbol }`. |
| Historial | GET `/reservations` | 200, array de reservas por inicio descendente, luego ID descendente. |
| Disponibilidad | GET `/availability?unit=MIC-01&start=2099-11-03T10:00&end=2099-11-03T11:00` | 200, `{ available: boolean, conflicts: Reservation[] }`. |
| Crear | POST `/reservations`, JSON de entrada. | 201, Reservation. |
| Cancelar | POST `/reservations/1/cancel`, sin cuerpo requerido. | 200, Reservation con status CANCELADA. |

Entrada de creación:

```json
{"unit":"MIC-01","requester":"Investigador A","start":"2099-11-03T10:00","end":"2099-11-03T11:00"}
```

Salida ilustrativa en una base vacía:

```json
{"id":1,"unit":"MIC-01","requester":"Investigador A","start":4097394000000,"end":4097397600000,"status":"ACTIVA"}
```

Entrada: fecha/hora argentina `AAAA-MM-DDTHH:mm`, sin segundos, Z u offset. Salida: instantes UTC en milisegundos. `10:00` argentina corresponde a `13:00Z`. Solicitante string normalizado, máximo 120 caracteres; ID de unidad exacto. Reglas temporales en [especificación](especificacion.md).

El historial no recibe filtros de servidor: búsqueda por texto y filtros de estado se aplican en la web. Las reservas pasadas siguen accesibles para historial/cancelación, pero no para consultas de disponibilidad con inicio pasado.

## 2. Secuencia de ejemplo sin tocar la base principal

Los comandos son una guía reproducible, no la afirmación de una ejecución humana. Usar una terminal nueva, desde la raíz, elegir una ruta aún no usada y otro puerto:

```powershell
$env:RESERVAS_DB='data/ejemplo-api.sqlite'
$env:PORT='3001'
npm start
```

Una ruta existente conserva sus datos. No se borra ni se reinicia automáticamente. Los ejemplos de fechas 2099 son válidos mientras sigan siendo futuros; elegir otra fecha libre si ya hay reservas.

En una segunda terminal PowerShell:

```powershell
$api='http://localhost:3001/api'
Invoke-RestMethod "$api/inventory"

$datos=@{unit='MIC-01';requester='Investigador A';start='2099-11-03T10:00';end='2099-11-03T11:00'}
$primera=Invoke-RestMethod "$api/reservations" -Method Post -ContentType 'application/json' -Body ($datos | ConvertTo-Json)
$primera

Invoke-RestMethod "$api/availability?unit=MIC-01&start=2099-11-03T10:30&end=2099-11-03T11:30"
```

Esperado: cinco unidades; creación con ACTIVA; disponibilidad `available: false` y la primera reserva en `conflicts`. Crear MIC-01 10:30–11:30 devolvería 409, sin insertar.

Consecutivo y distinta unidad:

```powershell
$consecutiva=@{unit='MIC-01';requester='Investigador B';start='2099-11-03T11:00';end='2099-11-03T12:00'}
Invoke-RestMethod "$api/reservations" -Method Post -ContentType 'application/json' -Body ($consecutiva | ConvertTo-Json)

$simultanea=@{unit='MIC-02';requester='Investigador C';start='2099-11-03T10:00';end='2099-11-03T11:00'}
Invoke-RestMethod "$api/reservations" -Method Post -ContentType 'application/json' -Body ($simultanea | ConvertTo-Json)

Invoke-RestMethod "$api/reservations/$($primera.id)/cancel" -Method Post
Invoke-RestMethod "$api/availability?unit=MIC-01&start=2099-11-03T10:00&end=2099-11-03T11:00"
Invoke-RestMethod "$api/reservations"
```

Esperado: ambas creaciones aceptadas; primera CANCELADA con ID y datos originales; MIC-01 10–11 libre; historial con tres registros, uno cancelado y dos activos. Cancelar de nuevo la primera devuelve CANCELADA sin borrar ni modificar otros datos.

Para persistencia: detener con Ctrl+C la terminal del servidor y ejecutar allí `npm start` sin cambiar variables ni ruta. Volver a listar desde la segunda terminal: mismos registros/ID/estados. Para otra base vacía, elegir otro archivo sin borrar este.

## 3. Errores

| Estado HTTP | Caso | Ejemplo de cuerpo |
| --- | --- | --- |
| 400 | Unidad desconocida. | `{"error":"Seleccioná una unidad del inventario."}` |
| 400 | Solicitante vacío/espacios. | `{"error":"Ingresá un solicitante ficticio."}` |
| 400 | Inicio igual o posterior al fin. | `{"error":"El inicio debe ser anterior al fin."}` |
| 400 | Inicio pasado. | `{"error":"El inicio no puede ser una fecha u hora que ya pasó (hora de Argentina)."}` |
| 400 | JSON mal formado, cuerpo incorrecto, fecha inválida, minutos o jornada incorrectos. | Mensaje específico del servidor. |
| 404 | ID de reserva inexistente. | `{"error":"No existe esa reserva."}` |
| 404 | Ruta API desconocida. | `{"error":"La operación no existe."}` |
| 409 | Conflicto activo en la misma unidad. | `{"error":"La unidad ya tiene una reserva activa en ese horario."}` |
| 413 | JSON excede el límite configurado de 16 kb. | `{"error":"La solicitud es demasiado grande."}` |
| 500 | Error interno no previsto. | `{"error":"No se pudo completar la operación."}` |

La consulta de un intervalo válido ocupado devuelve **200**, no 409; el booleano informa el resultado. Una creación que intenta ocuparlo devuelve 409. La validación del solicitante solo corresponde a creación. Los mensajes y estados reales proceden de [domain.ts](../server/domain.ts), [store.ts](../server/store.ts) y [app.ts](../server/app.ts).

## 4. Comprobación del agente

La suite T13 de [trazabilidad](trazabilidad.md) comprueba API con servidor real y base en memoria. Las consultas del conjunto demo también se comprobaron por HTTP. Durante esta ampliación documental se ejecutó además la secuencia equivalente de creación/conflicto/consecutivo/simultánea/cancelación mediante un servidor efímero con base en memoria: diez solicitudes correctas, resultado final de tres registros, dos activos y uno cancelado. Solicitudes y respuestas reales: [evidencia/api-documentada.json](evidencia/api-documentada.json); procedimiento y resultado en [verificación](verificacion.md). La guía PowerShell se ofrece como procedimiento, sin atribuir su ejecución completa al autor.
