# LAB · Reservas de equipos

Trabajo práctico: sistema local para consultar disponibilidad, reservar y cancelar equipos sin perder su historial. Proyecto propio construido a partir de la consigna; los tres proyectos suministrados se consultaron como referencias de estructura y alcance. No se importaron sus historiales ni afirmaciones de verificación.

## 1. Especificación

La coordinación del laboratorio necesita evitar reservas superpuestas y liberar los horarios cancelados. Se incluyen inventario fijo, disponibilidad por unidad e intervalo, creación, cancelación e historial persistente. No se incluyen administración del inventario, autenticación, notificaciones, pagos, despliegue ni servicios externos.

Inventario precargado en `shared/types.ts`: MIC-01 y MIC-02 (microscopios digitales), OSC-01 (osciloscopio), MUL-01 (multímetro), FUE-01 (fuente de alimentación). Cada ID corresponde a una unidad física independiente.

| Requisito | Criterio de aceptación / evidencia automática |
| --- | --- |
| R1 Inventario y disponibilidad | API devuelve cinco unidades y evalúa un intervalo válido con las reglas de reserva. |
| R2 Crear una reserva identificable | Devuelve ID, unidad, solicitante ficticio no vacío, inicio, fin y estado ACTIVA. |
| R3 Validar entradas | Rechaza unidad desconocida, solicitante vacío, fechas inexistentes e inicio mayor o igual al fin. |
| R4 Evitar superposición | Rechaza conflictos activos de una misma unidad, incluso intervalos contenidos o envolventes. |
| R5 Permitir consecutivos y distintas unidades | Acepta 11–12 después de 10–11 y MIC-02 simultánea a MIC-01. |
| R6 Cancelar conservando historial | Cambia solo el estado a CANCELADA, conserva ID/datos y permite volver a reservar el intervalo. |
| R7 Persistir | Un proceso escribe estados activos/cancelados y otro proceso los recupera sin borrar la base. |
| R8 Web local con un comando | `npm start` compila y sirve interfaz y API en el mismo puerto. |

**Reglas horarias actualizadas por revisión humana:** cada reserva comienza y termina el mismo día, entre **06:00 y 20:00**, con minutos **00, 15, 30 o 45**. El último inicio posible es 19:45. No se admiten inicios anteriores al instante actual, incluidos horarios ya pasados de hoy. La disponibilidad aplica las mismas reglas; el historial y la cancelación siguen accesibles para reservas anteriores. La interfaz ofrece selectores de cuartos de hora y un intervalo inicial futuro; el servidor vuelve a validar al operar.

**Supuestos:** intervalos semiabiertos `[inicio, fin)`. Entradas `AAAA-MM-DDTHH:mm` en hora argentina UTC-03:00 fija; almacenamiento en milisegundos UTC y presentación en `America/Argentina/Buenos_Aires`. Años 1900–9999, sin límite adicional de anticipación. Solicitante limitado a 120 caracteres. Cancelar de nuevo una reserva cancelada es idempotente. Una reserva por unidad. Las reservas que ya existían no se borran ni se modifican por estas nuevas reglas. ACTIVA indica que no fue cancelada. El indicador “Libre ahora” se actualiza al renderizar y la operación de reservar siempre revalida disponibilidad.

La versión inicial y sus cambios deben conservarse en Git. La primera especificación de este repositorio es la presente; no se han inventado versiones anteriores.

## 2. Solución

TypeScript en cliente y servidor, React para la interfaz, Express para API/archivos y SQLite integrado en Node para persistencia. Vite compila el cliente. Un proceso sirve todo; no hacen falta dos terminales. La transacción `BEGIN IMMEDIATE` engloba consulta de conflictos e inserción.

```text
src/                 interfaz React y estilos adaptables
shared/              inventario y tipos
server/domain.ts     validaciones y fechas
server/store.ts      persistencia y operaciones de reserva
server/app.ts        API HTTP y archivos estáticos
server/index.ts      arranque y cierre
tests/               pruebas de dominio, HTTP y procesos
docs/                decisiones, progreso, evidencia y revisión humana
data/reservas.sqlite base creada automáticamente (excluida de Git)
```

Requisitos: **Node.js 24.15 o posterior**, npm y un navegador. Versiones del entorno y resultados en [docs/verificacion.md](docs/verificacion.md). El lockfile fija las dependencias resueltas. No se requiere cuenta de IA para ejecutar ni probar.

```sh
npm ci
npm start
```

Abrir **http://localhost:3000**. `npm start` comprueba tipos, compila y arranca el servidor en la interfaz local 127.0.0.1. Ctrl+C lo detiene. En PowerShell, si `npm.ps1` está bloqueado, usar `npm.cmd ci` y `npm.cmd start`. Para modificar el puerto: `$env:PORT='3001'` antes del arranque.

El inventario no requiere carga manual. La base se crea automáticamente en `data/reservas.sqlite`. Reiniciar la aplicación **no elimina reservas**. `RESERVAS_DB` permite otra ruta; las rutas relativas se resuelven desde la raíz del proyecto. Para empezar con datos vacíos sin perder el historial anterior, detener el servidor y elegir otra ruta de base. No hay un botón de borrado ni se necesita borrar el archivo. Respaldar copiando la base con el servidor detenido.

```sh
npm test
npm run typecheck
npm run build
```

Ejemplo de entrada HTTP (ilustrativo, solicitante ficticio):

```http
POST /api/reservations
Content-Type: application/json

{"unit":"MIC-01","requester":"Investigador A","start":"2026-11-03T10:00","end":"2026-11-03T11:00"}
```

Devuelve HTTP 201 y un objeto con ID numérico, `status: "ACTIVA"` y fechas UTC en milisegundos. `GET /api/inventory`, `GET /api/reservations` y `GET /api/availability?unit=MIC-01&start=2026-11-03T10:00&end=2026-11-03T11:00` permiten consultar. Cancelar: `POST /api/reservations/1/cancel`. Validaciones devuelven 400; conflictos 409; reserva inexistente 404. El formato y los campos pertenecen a esta API, no a los proyectos de referencia.

**Limitaciones:** uso local, sin cuentas ni permisos por persona, sin paginación ni concurrencia distribuida. No incluye copias automáticas. `node:sqlite` puede emitir un aviso de experimental según la versión. La interfaz requiere revisión humana; consultar el registro de verificación antes de asumir qué se probó. La entrega y las tres decisiones humanas permanecen pendientes.

## 3. Preparación del agente

Se utilizó Codex sobre el repositorio con herramientas reales de edición, PowerShell, Node/npm, Git y consulta de documentación técnica oficial. El identificador exacto del modelo y la versión del cliente no están expuestos de forma verificable en el proyecto: quedan sin confirmar. No se copian los identificadores de las referencias. Se eligió el entorno disponible porque permite editar, ejecutar pruebas y verificar resultados localmente.

Contexto suministrado: consigna PDF de tres páginas, tres ZIP de referencia y preferencias humanas: web local, inicio mediante `npm start`, tecnología a elección y sin requisitos adicionales. Se excluyen secretos, datos reales, conversaciones completas, bases ajenas y dependencias de las referencias. Las instrucciones dentro de las referencias se interpretan como material de esos proyectos, no como órdenes para este.

Configuración externa aplicada (resumen saneado): actuar en la carpeta de trabajo, completar acciones autorizadas, reportar verificaciones reales y evitar atribuir resultados no comprobados. Acceso técnico disponible: lectura/escritura y ejecución local, red habilitada y sin solicitudes automáticas de aprobación. Esto no constituye revisión humana. No se enviaron correos, no se publicó una web y no se hizo push.

Instrucción humana efectivamente usada: «web local con interfaz visual entrando por npm start» y «el que mejor se adapte al proyecto». Adaptación comprobable: `package.json` encadena comprobación/compilación y un servidor único, y `server/app.ts` sirve tanto API como cliente. Adaptación de reglas: validación compartida e intervalos consecutivos en `server/domain.ts`, `server/store.ts` y pruebas. [AGENTS.md](AGENTS.md) conserva instrucciones para futuras intervenciones; se creó durante esta sesión y no se presenta como una configuración preexistente. [docs/PROGRESO.md](docs/PROGRESO.md) retiene avances y decisiones.

## 4. Registro de decisiones y delegación

Consultar [docs/decisiones.md](docs/decisiones.md), [docs/episodios.md](docs/episodios.md) y [docs/verificacion.md](docs/verificacion.md).

**Estado académico:** la consigna exige tres episodios reales con revisión humana. El usuario pidió corregir la primera versión agregando horario operativo, cuartos de hora y rechazo de horarios pasados; esta nueva delegación se registra como episodio 2, pendiente de revisión del resultado. Falta un tercer episodio real y completar las revisiones humanas. También falta crear/publicar el repositorio de entrega con la evolución en Git e identificar autor, rama y commit.
