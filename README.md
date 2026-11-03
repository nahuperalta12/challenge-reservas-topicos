# Sistema de reservas de equipos de laboratorio

**Autor:** Nahuel Peralta · **Challenge IA** · **Año:** 2026.

Aplicación web local para consultar disponibilidad, reservar y cancelar equipos sin perder el historial, desarrollada con Codex y revisión humana. Repositorio público: [nahuperalta12/challenge-reservas-topicos](https://github.com/nahuperalta12/challenge-reservas-topicos), rama `master`.

**Estado:** 16 pruebas automáticas aprobadas y compilación correcta, verificadas también desde una copia limpia. Tres episodios reales con decisión humana y motivo registrados. El envío del enlace de entrega está pendiente. La primera implementación anterior a las restricciones horarias no está recuperada en Git; se declara esa limitación en [la auditoría](docs/auditoria.md).

El README tiene las cuatro secciones de la consigna:

1. [Especificación](#1-especificación).
2. [Solución](#2-solución).
3. [Preparación del agente](#3-preparación-del-agente).
4. [Registro de decisiones y delegación](#4-registro-de-decisiones-y-delegación).

## 1. Especificación

### 1.1 Problema y objetivo

La coordinación de un laboratorio registra pedidos mediante mensajes y planillas. Esto puede confirmar una misma unidad en horarios superpuestos y mantener bloqueado un horario después de una cancelación. El objetivo es consultar disponibilidad, crear reservas identificables y cancelar conservando los datos y estados al reiniciar.

### 1.2 Alcance

**Incluye:** inventario fijo, disponibilidad por unidad e intervalo, creación, cancelación, historial con búsqueda y filtro de estado en la web, persistencia SQLite y carga opcional de ejemplos ficticios. Cada reserva corresponde a una unidad física.

**Fuera de alcance:** administración del inventario, edición o reactivación de reservas, autenticación y roles reales, notificaciones, pagos, integraciones de negocio, despliegue y concurrencia distribuida. GitHub se usa para entregar código; la aplicación se ejecuta localmente.

### 1.3 Inventario precargado

Versionado como constante en [shared/types.ts](shared/types.ts); no requiere carga manual ni una tabla editable.

| ID de unidad | Equipo |
| --- | --- |
| MIC-01 | Microscopio digital |
| MIC-02 | Microscopio digital |
| OSC-01 | Osciloscopio |
| MUL-01 | Multímetro |
| FUE-01 | Fuente de alimentación |

### 1.4 Requisitos funcionales verificables

Se mantienen los identificadores **R1–R8** de la documentación anterior. RF-01–RF-10 los desglosan sin reemplazar la evidencia previa.

| ID | Requisito | Referencia previa | Evidencia |
| --- | --- | --- | --- |
| RF-01 | Mostrar las cinco unidades con ID y equipo. | R1 | API de inventario. |
| RF-02 | Consultar disponibilidad y reservas activas en conflicto. | R1, R4, R5 | `Store.availability` y pruebas. |
| RF-03 | Crear reserva con ID, unidad, solicitante, inicio, fin y estado ACTIVA. | R2 | `Store.create` y prueba de creación. |
| RF-04 | Rechazar entradas inválidas sin insertar una reserva. | R3 | Dominio y pruebas de validación. |
| RF-05 | Evitar solapamientos activos; permitir consecutivos y unidades distintas. | R4, R5 | Pruebas de conflictos, límites y simultaneidad. |
| RF-06 | Cancelar conservando ID/datos y liberar el intervalo. | R6 | `Store.cancel` y pruebas. |
| RF-07 | Listar reservas activas y canceladas, incluidas las históricas. | R6, R7 | API e historial React. |
| RF-08 | Recuperar reservas y estados en otro proceso después del cierre. | R7 | Prueba de persistencia entre procesos. |
| RF-09 | Compilar y servir interfaz y API con `npm start`. | R8 | Arranque y HTTP comprobados. |
| RF-10 | Cargar ejemplos bajo pedido sin modificar registros previos ni duplicar la carga. | Ampliación, episodio 3 | `npm run seed` y dos pruebas. |

Detalle: [docs/especificacion.md](docs/especificacion.md). Relación con funciones y nombres exactos de pruebas: [docs/trazabilidad.md](docs/trazabilidad.md).

### 1.5 Reglas de negocio

| ID | Regla |
| --- | --- |
| RN-01 | La unidad coincide exactamente con un ID del inventario. |
| RN-02 | Solicitante ficticio no vacío ni solo espacios; recorte de extremos y máximo 120 caracteres. |
| RN-03 | Entrada `AAAA-MM-DDTHH:mm`, fecha/hora existentes, años 1900–9999. |
| RN-04 | Inicio estrictamente anterior al fin; ambos en la misma fecha argentina. |
| RN-05 | Jornada 06:00–20:00 y minutos 00/15/30/45. Último inicio 19:45. |
| RN-06 | Inicio no anterior al instante actual del servidor, considerando segundos transcurridos. |
| RN-07 | Intervalos `[inicio, fin)`. Solo ACTIVA bloquea. |
| RN-08 | Misma unidad: conflicto si `existente.start < nueva.end` y `existente.end > nueva.start`. |
| RN-09 | Consecutivos y unidades distintas simultáneas permitidos. |
| RN-10 | Disponibilidad y creación comparten validación de intervalo y consulta de conflictos; solo crear exige solicitante. |
| RN-11 | Cancelar cambia solo el estado a CANCELADA; admite reservas históricas y nunca borra el registro. |
| RN-12 | Repetir cancelación es idempotente; ID inválido devuelve 400 e inexistente 404. |

Ejemplo: MIC-01 de 10:00 a 11:00 impide 10:30–11:30; permite 11:00–12:00 y MIC-02 de 10:00 a 11:00. Las restricciones horarias provienen de la corrección humana del episodio 2, posteriormente aceptada.

### 1.6 Supuestos

| ID | Supuesto adoptado |
| --- | --- |
| S-01 | Entradas en hora argentina UTC-03:00 fija, independientemente de la zona del equipo. |
| S-02 | Fechas guardadas como milisegundos UTC y mostradas con `America/Argentina/Buenos_Aires`. La entrada no acepta `Z` ni offsets. |
| S-03 | Duración mínima 15 minutos y máxima 14 horas por la jornada. Sin límite adicional de anticipación dentro de los años admitidos. |
| S-04 | Reloj real del servidor; inyección de reloj solo en pruebas, sin opción de API para modificarlo. |
| S-05 | ID entero autoincremental conservado al cancelar. ACTIVA significa no cancelada, aunque su horario ya haya terminado. |
| S-06 | Uso local; transacción `BEGIN IMMEDIATE` para consulta e inserción. Sin concurrencia distribuida. |
| S-07 | Iniciar no borra datos. Una ruta nueva permite otra base vacía conservando la anterior. |
| S-08 | “Libre ahora” es orientativo; la operación siempre revalida en el servidor. |

### 1.7 Criterios de aceptación

Usar fechas futuras o reloj controlado. La evidencia automática corresponde al agente, no a una revisión humana.

| ID | Se acepta si… | Verificación |
| --- | --- | --- |
| CA-01 | Se muestran exactamente las cinco unidades. | Automática, API. |
| CA-02 | Una reserva válida obtiene ID, datos normalizados y estado ACTIVA. | Automática, dominio. |
| CA-03 | Se rechazan conflictos parciales, contenidos, envolventes e iguales sin insertar. | Automática, dominio/API. |
| CA-04 | Se permiten consecutivos por ambos extremos y unidades distintas simultáneas. | Automática, dominio. |
| CA-05 | Se rechazan entradas inválidas, fuera de jornada, minutos incorrectos e inicios pasados. | Automática, dominio/API. |
| CA-06 | Cancelar conserva datos, libera el intervalo, permite volver a reservar y es idempotente. | Automática, dominio/API. |
| CA-07 | Disponibilidad y creación coinciden en validación y conflicto. | Automática, dominio. |
| CA-08 | Otro proceso recupera una activa y una cancelada con estados y disponibilidad correctos. | Automática, procesos. |
| CA-09 | `npm start` compila y sirve web/API en el mismo puerto local. | Arranque y HTTP comprobados. |
| CA-10 | Las funciones del selector ofrecen cuartos de hora y un intervalo inicial futuro válido. | Automática de funciones; recorrido visual no completado. |
| CA-11 | Nueva carga: ocho ejemplos; repetición: cero nuevos; registros previos conservados. | Automática y carga local comprobada. |

Cada prueba puede cubrir varios casos. [La matriz](docs/trazabilidad.md) distingue cobertura automática, inspección de código y pasos manuales no informados.

### 1.8 Modelo de datos

SQLite guarda `reservations`; esquema real en [server/store.ts](server/store.ts).

| Campo | Tipo | Significado |
| --- | --- | --- |
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | Identificador. |
| `unit` | TEXT NOT NULL | ID de unidad, validado en el dominio. |
| `requester` | TEXT NOT NULL | Solicitante ficticio validado. |
| `start`, `end` | INTEGER NOT NULL | Milisegundos UTC, CHECK `start < end`. |
| `status` | TEXT NOT NULL | CHECK ACTIVA o CANCELADA. |

Índice `reservations_interval(unit, status, start, end)`. No hay tabla de usuarios ni campos de fecha de creación o cancelación.

### 1.9 Evolución de la especificación

| Etapa | Cambio y motivo | Versión recuperable |
| --- | --- | --- |
| Primera construcción | Web, reservas e historial; inicialmente admitía pasado. | Registro narrativo; sin commit original recuperado. |
| Episodio 2 | Jornada, cuartos de hora y rechazo de pasado por pedido humano. | Estado corregido capturado después en [`0a27447`](https://github.com/nahuperalta12/challenge-reservas-topicos/commit/0a27447). |
| Episodio 3 | Auditoría y carga para facilitar pruebas. | [`6fa2060`](https://github.com/nahuperalta12/challenge-reservas-topicos/commit/6fa2060). |
| Revisión y publicación | Autor, aceptación expresa, reproducción limpia y GitHub. | [`7b5762f`](https://github.com/nahuperalta12/challenge-reservas-topicos/commit/7b5762f), [`d3fe218`](https://github.com/nahuperalta12/challenge-reservas-topicos/commit/d3fe218). |
| Ampliación documental | RF/RN/S/CA, trazabilidad y documentación similar a las referencias, sin cambiar comportamiento. | Commit que agrega especificacion.md y trazabilidad.md; consultar `git log`. |

La primera especificación versionada corresponde al estado de `0a27447`, no a la implementación previa. Motivos y consecuencias: [decisiones](docs/decisiones.md).

## 2. Solución

### 2.1 Arquitectura y estructura

TypeScript, React, Express, SQLite integrado en Node y Vite. Un proceso sirve interfaz y API. Flujo: **React → API Express → Store → dominio / SQLite**.

```text
src/main.tsx              interfaz, búsqueda, filtros y confirmación de cancelación
src/style.css             estilos adaptables
shared/types.ts           inventario y contratos
shared/schedule.ts        jornada y funciones de selección
server/domain.ts          validación, fechas y errores
server/store.ts           SQLite y operaciones
server/app.ts             rutas HTTP y archivos estáticos
server/index.ts           arranque y cierre
server/demo.ts / seed.ts  ejemplos y comando de carga
tests/                    dominio, API, procesos y ejemplos
docs/                     especificación, agente, decisiones y evidencia
data/reservas.sqlite      base local, excluida de Git
```

`Store.create` inicia `BEGIN IMMEDIATE`, comprueba disponibilidad y guarda antes de confirmar. Ante error revierte. La interfaz no reemplaza la validación del servidor.

### 2.2 Decisiones técnicas

| Tema | Elección y motivo | Registro |
| --- | --- | --- |
| Interfaz | Web local y arranque único por preferencia del autor. | D1 |
| Stack | TypeScript/React/Express para compartir lenguaje y tipos. | D2 |
| Datos | SQLite, sin instalar motor externo. | D3 |
| Fechas | UTC-03:00 explícito, independiente del equipo. | D4 |
| Historial | Cambio de estado sin borrar; cancelación idempotente. | D6 |
| Horarios | Reglas operativas solicitadas por el autor. | D8, D9 |
| Ejemplos | Carga explícita, futura y sin duplicación. | D10 |

Alternativas y consecuencias en [docs/decisiones.md](docs/decisiones.md).

### 2.3 Requisitos previos y versiones

| Herramienta | Requisito / versión observada | Comprobación |
| --- | --- | --- |
| Sistema | Desarrollo comprobado en Windows con PowerShell. | Entorno real. |
| Node.js | **24.15 o posterior**; observado v24.15.0. | `node --version` |
| npm | Observado 11.12.1. | `npm --version` |
| Git | Observado 2.46.0.windows.1. | `git --version` |
| Navegador | Acceso a localhost. | URL local. |

Dependencias: [package.json](package.json); versiones resueltas: [package-lock.json](package-lock.json). No se requiere Python, motor SQLite separado ni cuenta de IA para ejecutar o probar.

### 2.4 Instalación desde cero

```sh
git clone https://github.com/nahuperalta12/challenge-reservas-topicos.git
cd challenge-reservas-topicos
npm ci
npm start
```

Abrir **http://localhost:3000**. Se ejecutan tipos/build y servidor en `127.0.0.1`. Ctrl+C detiene. Si PowerShell bloquea `npm.ps1`, usar `npm.cmd ci` y `npm.cmd start`.

### 2.5 Carga inicial y ejemplos

La base se crea automáticamente y el inventario siempre está precargado. Una instalación nueva comienza sin reservas. Para disponer de ejemplos:

```sh
npm run seed
npm start
```

Agrega ocho registros `[DEMO]`: seis activos y dos cancelados para mañana en Argentina o el siguiente día sin conflictos dentro de 366 días. Si ya hay registros `[DEMO]`, no agrega más ni reactiva cancelaciones. Conserva datos previos y respeta `RESERVAS_DB`. La carga completa no es atómica: ante interrupción, revisar antes de repetir. Tabla y escenarios: [docs/datos-demo.md](docs/datos-demo.md).

### 2.6 Persistencia y otra base vacía

Por defecto: `data/reservas.sqlite`, excluida de Git. **Reiniciar no borra reservas.** Para otra base, detener el servidor y elegir una ruta nueva en PowerShell:

```powershell
$env:RESERVAS_DB='data/pruebas-nuevas.sqlite'
npm start
```

Si la ruta existe, conserva sus datos. La anterior no se elimina. Para volver a la base predeterminada en una ejecución posterior:

```powershell
Remove-Item Env:RESERVAS_DB -ErrorAction SilentlyContinue
npm start
```

Ese comando retira una variable, no un archivo. Las rutas relativas se resuelven desde el directorio de trabajo: ejecutar desde la raíz del proyecto. Respaldar copiando la base con el servidor detenido.

### 2.7 Comandos y configuración

| Comando / variable | Función |
| --- | --- |
| `npm ci` | Instalar según lockfile. |
| `npm start` | Tipos, build y servidor web/API. |
| `npm test` | Pruebas con bases independientes de la principal. |
| `npm run typecheck` | Comprobar TypeScript. |
| `npm run build` | Tipos y compilación a `dist/`. |
| `npm run seed` | Carga explícita de ejemplos ficticios. |
| `PORT` | Puerto 1–65535, por defecto 3000. |
| `RESERVAS_DB` | Ruta, por defecto `data/reservas.sqlite`. |

Otro puerto en PowerShell: `$env:PORT='3001'` y luego `npm start`.

### 2.8 Uso web y ejemplos de API

Seleccionar unidad, fecha e intervalo, consultar disponibilidad, ingresar solicitante ficticio y crear. El historial permite búsqueda por solicitante/unidad/ID y filtros de estado. Cancelar abre confirmación y conserva la fila cancelada. “Volver” no envía la cancelación.

| Método y ruta | Respuesta correcta |
| --- | --- |
| `GET /api/inventory` | 200, cinco unidades. |
| `GET /api/availability?unit=…&start=…&end=…` | 200, `{ available, conflicts }`. |
| `POST /api/reservations` | 201, reserva creada. |
| `GET /api/reservations` | 200, historial completo. |
| `POST /api/reservations/:id/cancel` | 200, reserva CANCELADA. |

Entrada ilustrativa en una base sin conflicto y con fecha futura:

```http
POST /api/reservations
Content-Type: application/json

{"unit":"MIC-01","requester":"Investigador A","start":"2099-11-03T10:00","end":"2099-11-03T11:00"}
```

Salida 201 (ID ilustrativo):

```json
{"id":1,"unit":"MIC-01","requester":"Investigador A","start":4097394000000,"end":4097397600000,"status":"ACTIVA"}
```

Con esa reserva, MIC-01 10:30–11:30 está ocupada y crear devuelve 409; MIC-01 11–12 y MIC-02 10–11 están disponibles. Cancelar ID 1 devuelve los mismos datos con CANCELADA y libera 10–11.

Errores JSON `{ "error": "mensaje" }`: 400 por datos inválidos, 404 por reserva inexistente y 409 por conflicto. Contratos y ejemplos ejecutables: [docs/api.md](docs/api.md).

### 2.9 Pruebas y verificación

```sh
npm test
npm run build
```

Resultado: **16 aprobadas, 0 fallos**, tipos y compilación correctos. Incluye dominio, API, persistencia entre dos procesos y carga demo. Se verificó desde una copia limpia con `npm ci`. Resultados, comandos y fallos intermedios: [docs/verificacion.md](docs/verificacion.md).

Procedimiento manual: elegir fecha futura libre; crear MIC-01 10–11; intentar 10:30–11:30; crear 11–12 y MIC-02 10–11; cancelar la primera y consultar su intervalo; cerrar y reiniciar sin cambiar de base, comprobando mismos ID/datos/estados. Guía completa en [verificación](docs/verificacion.md).

La persistencia se comprobó automáticamente. El autor aceptó los resultados de episodios 2 y 3, pero no informó un recorrido manual paso a paso. La revisión visual del agente no se completó por una limitación de Computer Use. No se atribuyen esos pasos al autor.

### 2.10 Pendientes y limitaciones

Uso local, sin cuentas, permisos por persona, paginación, copias automáticas ni concurrencia distribuida. “Libre ahora” es orientativo y reservar revalida. `node:sqlite` puede emitir un aviso experimental según la versión.

Repositorio público listo; correo de entrega pendiente. Limitación Git anterior al estado recibido declarada. Estado completo: [auditoría](docs/auditoria.md), [entrega](docs/entrega.md) y [retrospectiva](docs/retrospectiva.md).

## 3. Preparación del agente

### 3.1 Entorno, modelo y función

**Codex** actuó sobre archivos reales con PowerShell, Node/npm y Git: implementación, pruebas y documentación. El autor definió preferencias, corrigió reglas y aceptó resultados. Se eligió el entorno disponible por permitir editar y comprobar directamente el proyecto.

Se comprobaron Windows/PowerShell y las versiones de herramientas indicadas en §2.3. Identificador exacto del modelo y versión del cliente de los episodios: **no confirmados** de forma verificable. No se copian los datos de las referencias. Detalle: [docs/agente.md](docs/agente.md).

### 3.2 Instrucciones y configuración

[AGENTS.md](AGENTS.md) exige leer README/progreso, mantener web local con `npm start` y SQLite, compartir validación, usar UTC-03:00, conservar historial y registrar resultados reales. Tras cambios funcionales exige pruebas/build.

La configuración externa permitió lectura, escritura, comandos y red, sin aprobaciones automáticas por herramienta. Esas capacidades no sustituyen la autorización del autor. Por instrucción expresa se publicó en GitHub; no se envió correo. Extracto saneado y evidencia de aplicación: [docs/agente.md](docs/agente.md).

### 3.3 Contexto suministrado y excluido

Consigna PDF de tres páginas, ZIP de referencia, preferencia de web local, correcciones horarias y pedido de datos demo. Esta ampliación compara la organización documental de esas referencias.

Se excluyen secretos, credenciales, datos reales de estudiantes, conversaciones completas y bases/dependencias ajenas. Se usan solicitantes ficticios. Las instrucciones internas de las referencias se tratan como material de esos proyectos, no como órdenes de este.

### 3.4 Herramientas, permisos y controles

| Acción | Control / resultado |
| --- | --- |
| Editar y ejecutar | Instrucciones del proyecto, revisión de cambios y resultados registrados. |
| Verificar funcionalidad | Bases independientes, pruebas y build. |
| Cambiar reglas | Pedido humano y motivos del episodio 2. |
| Registrar revisión | Decisión explícita recibida, sin inventar pasos manuales. |
| Publicar | Pedido del autor para `nahuperalta12`, sesión existente de Git Credential Manager y acceso público verificado. |
| Revisar visualmente | Intento detenido por la herramienta; no declarado completado. |

No se requirieron subagentes, servicios pagos ni integraciones de negocio. No se almacenan credenciales de GitHub en el repositorio.

### 3.5 Adaptaciones específicas

| Adaptación | Evidencia |
| --- | --- |
| Arranque único | `package.json`, `server/app.ts`. |
| Misma validación y conflictos | `validateInterval`, `Store.availability` y llamada desde `Store.create`. |
| Consecutivos y cancelación libre | Comparaciones estrictas y filtro ACTIVA en SQL; pruebas de límites/cancelación. |
| Hora argentina | Offset en `parseLocal`, `argentinaLocal` y formateadores con zona explícita. |
| Jornada y rechazo de pasado | `shared/schedule.ts`, `server/domain.ts`, selectores y reloj controlado. |
| Persistencia | Prueba de escritura/lectura en procesos independientes. |

### 3.6 Retención del progreso

Se conserva en [PROGRESO](docs/PROGRESO.md), [decisiones](docs/decisiones.md), [episodios](docs/episodios.md), [verificación](docs/verificacion.md) y Git. Al retomar se leen README y progreso. Los registros históricos muestran el estado de cada etapa; entradas posteriores documentan su resolución. No se reconstruye una historia inicial inexistente.

## 4. Registro de decisiones y delegación

### 4.1 Decisiones significativas

D1–D11 documentan interfaz, stack, SQLite, zona horaria, cancelación, evolución horaria, ejemplos y versionado. D12 registra esta ampliación documental solicitada por el autor. Motivos, alternativas y consecuencias: [docs/decisiones.md](docs/decisiones.md).

### 4.2 Tres episodios reales

| Episodio | Objetivo / instrucción | Resultado | Decisión humana y motivo | Evidencia |
| --- | --- | --- | --- | --- |
| 1. Primera web | «web local con interfaz visual entrando por npm start»; tecnología a criterio. | Aplicación, SQLite, pruebas y documentación. | **CORREGIR:** jornada, cuartos de hora y rechazo de pasado. | Registro narrativo; primera implementación sin commit recuperado. |
| 2. Horarios | «horarios sean de 6am y como maximo 8pm», minutos cada 15 y no reservar pasado. | Validación compartida, selectores y pruebas. | **ACEPTAR:** franja de laboratorio estándar para realismo; no admitir pasado para integridad. | Dominio, schedule y pruebas; estado corregido en `0a27447`. |
| 3. Auditoría y ejemplos | Revisar requisitos y cargar registros para probar. | Auditoría, ocho ejemplos y dos pruebas nuevas. | **ACEPTAR:** disponer de datos para controlar funcionamiento. | `server/demo.ts`, `tests/demo.test.ts`, datos-demo.md; `6fa2060`. |

El autor confirmó para episodios 2 y 3: «Acepto ambos resultados por los motivos que expliqué». No se equipara con ejecutar una guía manual no informada. Contexto, extractos, acciones y motivos completos: [docs/episodios.md](docs/episodios.md).

### 4.3 Mapa de documentación

| Documento | Contenido |
| --- | --- |
| [Especificación](docs/especificacion.md) | Requisitos, reglas, supuestos, aceptación y datos. |
| [Trazabilidad](docs/trazabilidad.md) | Requisito → código → prueba → evidencia. |
| [API](docs/api.md) | Rutas, entradas/salidas y errores. |
| [Agente](docs/agente.md) | Entorno, instrucciones, contexto y controles. |
| [Decisiones](docs/decisiones.md) | Motivos, alternativas y consecuencias. |
| [Episodios](docs/episodios.md) | Delegaciones y decisiones humanas reales. |
| [Verificación](docs/verificacion.md) | Comandos, resultados y pasos pendientes. |
| [Progreso](docs/PROGRESO.md) | Avances por etapa. |
| [Retrospectiva](docs/retrospectiva.md) | Resultados, dificultades y comparación documental. |
| [Auditoría](docs/auditoria.md) | Cumplimiento y limitaciones. |
| [Entrega](docs/entrega.md) | Repositorio, rama y correo pendiente. |

Se adoptan la organización y el detalle de las referencias suministradas. Los requisitos reflejan esta web TypeScript: jornada 06–20, cancelación idempotente y conservación de bases. Los modelos, commits, herramientas y verificaciones de los otros proyectos no se presentan como propios.
