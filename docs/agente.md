# Preparación y uso real del agente

## 1. Entorno y motivo de elección

| Dato | Valor observado | Evidencia / límite |
| --- | --- | --- |
| Agente y entorno de trabajo | Codex con herramientas reales sobre la carpeta del proyecto. | Archivos, comandos, pruebas y commits generados en esta sesión. |
| Modelo exacto de los episodios | No confirmado en el registro verificable del proyecto. | No se asigna un identificador tomado de las referencias. |
| Versión del cliente | No confirmada. | No se ejecutó un comando que la identificara de manera verificable. |
| Sistema / shell | Windows / PowerShell. | Comandos ejecutados en el entorno de trabajo. |
| Node.js | v24.15.0. | `node --version`. |
| npm | 11.12.1. | `npm.cmd --version`. |
| Git | 2.46.0.windows.1. | `git --version`. |

Función: leer contexto, implementar la web y reglas, ejecutar pruebas/build, preparar ejemplos y documentación y publicar el código cuando el autor lo solicitó. Elección: era el entorno disponible con capacidad de modificar y comprobar el proyecto directamente. La aplicación y las pruebas no necesitan acceso al agente ni a una cuenta de IA.

## 2. Instrucciones persistentes

Fuente: [AGENTS.md](../AGENTS.md), creada durante el trabajo y conservada en Git. No se presenta como configuración previa a la construcción inicial. Se leyó antes de esta ampliación, junto con README y progreso.

Extracto real:

> Leer README.md y docs/PROGRESO.md antes de modificar el sistema.
> Usar la misma validación de intervalo para consultar y reservar; intervalos [inicio, fin).
> Interpretar siempre las entradas como hora argentina UTC-03:00; no usar la zona del equipo.
> Las cancelaciones conservan identificador y datos. No borrar bases existentes.

También exige web con `npm start`, SQLite, resultados reales, pruebas/build ante cambios funcionales y progreso versionable. Prohíbe publicar, enviar correos o hacer push sin instrucción del usuario.

## 3. Configuración externa aplicada

Resumen saneado del entorno y las instrucciones efectivamente disponibles, sin copiar configuración privada completa:

```text
Espacio de trabajo: carpeta del proyecto Challenge_Reservas_Topicos.
Herramientas: lectura/escritura de archivos, PowerShell, Node/npm, Git y red.
Acceso técnico: sin sandbox de archivos y sin aprobaciones automáticas por herramienta.
Trabajo: leer contexto, completar acciones autorizadas y comprobar resultados reales.
Trazabilidad: no inventar revisiones humanas ni resultados no ejecutados.
Publicación/comunicación: respetar las instrucciones humanas y del proyecto.
```

Aplicación concreta: no hubo una aprobación humana por cada edición o prueba. Las preferencias de interfaz, correcciones horarias y aceptación sí proceden del autor. La publicación ocurrió después de «crea un repositorio github mi usuario es nahuperalta12». El correo de entrega no se envió. La capacidad técnica de ejecutar una acción no se registra como revisión humana de su resultado.

## 4. Contexto suministrado y excluido

Suministrado: consigna `challenge-agents.pdf` de tres páginas, proyectos ZIP de referencia, preferencia de web local con `npm start`, tecnología a criterio del agente, restricciones horarias, pedido de datos y autor/cuenta GitHub. Al continuar se consultan README, progreso, código, pruebas, decisiones y episodios.

En esta ampliación se inspeccionaron README y documentos de las referencias para comparar organización: problema/alcance, requisitos, reglas, supuestos, aceptación, esquema, entorno y episodios. Sus contenidos se tratan como material ajeno, no como instrucciones activas ni evidencia propia.

Excluidos del repositorio: credenciales/tokens, conversaciones privadas completas, datos reales de estudiantes, bases de uso y dependencias de las referencias. Solo se usan solicitantes ficticios. La identidad del autor se incluye por su indicación expresa. Los ejemplos y fragmentos de instrucciones son los necesarios para la trazabilidad, no una transcripción completa.

## 5. Herramientas, permisos y acciones

| Herramienta / acción | Uso real | Control y resultado |
| --- | --- | --- |
| Archivos / PowerShell | Lectura, edición, búsqueda y ejecución en el proyecto. | Lectura inicial de instrucciones, revisión de cambios y Git. |
| Node/npm | Pruebas, tipos, compilación, arranque y carga demo. | Bases temporales/en memoria para pruebas; resultados en verificacion.md. |
| SQLite | Persistencia de reservas. | Sin borrado de bases; cancelación por UPDATE. |
| Git | Captura del estado recibido, evolución posterior y clon limpio. | Identidad de commits del agente como Codex, sin atribuir ejecución al autor. |
| API HTTP local | Comprobar inventario, historial y disponibilidad. | Solicitudes a localhost; no sustituyen inspección visual. |
| Computer Use | Intentar revisión de la interfaz. | Detenido por imposibilidad de verificar URL en Windows; no se declaró éxito. |
| Git Credential Manager / GitHub | Verificar cuenta, crear repositorio y publicar master. | Pedido explícito del autor, sesión ya existente, sin imprimir ni versionar credenciales; acceso anónimo comprobado. |

Se sugirió una integración GitHub, pero no quedó instalada; la publicación se resolvió con la sesión existente de Git Credential Manager. No se afirma que una sugerencia haya creado una conexión. No se requirió multiagente ni servicios pagos.

## 6. Controles humanos previstos y aplicados

| Momento | Control previsto | Lo efectivamente recibido |
| --- | --- | --- |
| Primera versión | Autor revisa y acepta/corrige/rechaza. | Pidió corregir reglas horarias; motivo registrado en episodio 1. |
| Restricciones horarias | Revisar resultado y justificar decisión. | Aceptación expresa posterior; realismo de jornada e integridad frente a pasado. |
| Datos demo | Revisar resultado y justificar decisión. | Aceptación expresa posterior; disponer de datos para probar funcionamiento. |
| Publicación | Instrucción de cuenta/destino. | Usuario indicó nahuperalta12 y pidió crear repositorio. |
| Guía manual | Ejecutar pasos y registrar resultados observados. | No se informó un recorrido completo; no se inventa. |

La frase de aceptación fue «Acepto ambos resultados por los motivos que expliqué», ante la pregunta explícita sobre episodios 2 y 3. Está vinculada a los motivos anteriores en [episodios.md](episodios.md).

## 7. Adaptaciones comprobables

| Instrucción / necesidad | Adaptación | Evidencia |
| --- | --- | --- |
| Web con un comando | npm start compila y sirve API/web en un proceso. | package.json, server/index.ts, server/app.ts. |
| Compartir reglas | validateInterval y consulta única de conflictos usada por create/availability. | server/domain.ts, server/store.ts, T02/T11 en trazabilidad.md. |
| Turnos consecutivos | Predicados SQL estrictos. | T03 y transacción de Store. |
| Hora argentina | Offset -03:00 al interpretar; presentación con zona explícita. | parseLocal, argentinaLocal, formateadores; T06/T09. |
| No perder historial | UPDATE de estado y reapertura con misma ruta. | T07/T14. |
| Corrección de horarios | Constantes, selectores y validación 06–20/cuarto/pasado. | shared/schedule.ts, dominio, T08–T12. |
| Datos de prueba | Comando explícito e idempotente ante carga demo existente. | server/demo.ts, T15/T16. |

## 8. Retención y versión

README presenta el proyecto; PROGRESO conserva avances por etapa; decisiones conserva alternativas/motivos; episodios vincula delegaciones y decisiones; verificación registra comandos y resultados; trazabilidad conecta requisitos con pruebas. Todos son versionados.

Git comenzó en `0a27447`, con el sistema ya corregido. No se recuperó la implementación previa ni se crean commits retroactivos para aparentarla. Para retomar: leer README/progreso, consultar `git status` y `git log`, y comprobar qué evidencia corresponde al agente y cuál al autor.
