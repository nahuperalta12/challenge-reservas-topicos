# Auditoría contra la consigna · 2026-11-02

Fuente leída íntegramente por el agente: `C:\Users\UPSTI-52\Downloads\challenge-agents.pdf`, tres páginas. Resultado: **alcance funcional verificado automáticamente; entrega académica todavía incompleta**. Los datos de ejemplo ayudan a probar, pero no reemplazan pruebas ni decisiones humanas.

| Exigencia | Estado y evidencia |
| --- | --- |
| Inventario fijo y disponibilidad por unidad/intervalo | Verificado: cinco unidades, API y pruebas. |
| Creación identificable y entradas válidas | Verificado: pruebas de creación, normalización, fechas, unidad y solicitante. |
| Conflictos, consecutivos y unidades simultáneas | Verificado: pruebas de intervalos contenidos, envolventes, iguales y límites [inicio, fin). |
| Cancelar sin perder datos y liberar intervalo | Verificado: pruebas de ID/datos conservados, idempotencia y nueva reserva. |
| Persistencia activa/cancelada tras reiniciar | Verificado automáticamente con dos procesos independientes y base temporal. |
| Aplicación local reproducible sin cuenta de IA | `npm start`, tipos/build correctos, página HTTP 200 y API operativa. |
| Formato, zona horaria y límites explícitos | README, dominio y pruebas: UTC-03:00, 06–20, cuartos de hora, sin pasado, un día, sin límite adicional de anticipación. |
| Código, pruebas, inventario, lockfile y README de cuatro secciones | Presentes. Se agregó carga opcional reproducible, que no era requisito de datos persistidos de la consigna. |
| Preparación del agente, contexto, permisos y adaptación | Documentados en README, AGENTS y docs. Identificador exacto del modelo/cliente no verificable: declarado sin inventar. |
| Progreso y decisiones versionados | Git inicializado en esta auditoría. `0a27447` conserva el estado recibido, ya con las reglas del episodio 2. La especificación/código originales anteriores no están recuperados en Git; el registro narrativo no reemplaza esa evidencia. No se fabricó historia anterior. |
| Tres episodios con decisión humana y motivo | Hay tres delegaciones reales. Episodio 1: corrección humana registrada. Episodios 2 y 3: resultados pendientes de revisión humana; no se asume aceptación. |
| Evidencia ligada a versión | Commit del estado recibido y commit de esta auditoría consultables en `git log`. Los episodios anteriores no tenían commits propios. |
| Entrega de enlace accesible por correo, asunto Challenge IA | Pendiente. No se configuró remoto ni se publicó, hizo push o envió correo. Requiere instrucción del usuario. Identidad del autor pendiente; rama local master y commit obtenible con `git rev-parse HEAD`. |

## Pendientes que no puede reemplazar una carga de datos

El usuario debe comunicar su decisión de aceptar, corregir o rechazar los resultados de los episodios 2 y 3, con un motivo. Debe revisarse la evidencia histórica disponible de la primera versión para cumplir la evolución recuperable solicitada, sin inventarla. Para entregar falta identificar al autor y disponer del repositorio accesible y su enlace; la consigna solicita enviar ese enlace con asunto exacto `Challenge IA`. No se exige despliegue, autenticación, multiagente ni más estética.

No se efectuó revisión visual de la interfaz en esta auditoría. Los resultados automáticos y las comprobaciones HTTP se registran en `verificacion.md` y no se atribuyen al usuario.
