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
| Tres episodios con decisión humana y motivo | Completado: episodio 1 corregido por decisión humana; episodios 2 y 3 aceptados expresamente por Nahuel Peralta el 2026-11-02 con motivos registrados en episodios.md. No se atribuye ejecución manual no informada. |
| Evidencia ligada a versión | Commit del estado recibido y commit de esta auditoría consultables en `git log`. Los episodios anteriores no tenían commits propios. |
| Entrega de enlace accesible por correo, asunto Challenge IA | Autor: Nahuel Peralta. Repositorio público creado y master subida en https://github.com/nahuperalta12/challenge-reservas-topicos, acceso sin autenticación comprobado. Correo pendiente; borrador en entrega.md. Commit obtenible con `git rev-parse HEAD`. |

## Pendientes que no puede reemplazar una carga de datos

Las decisiones y motivos humanos de los tres episodios están registrados. Sigue faltando la evidencia Git histórica anterior al primer commit local; no se puede sustituir por una reconstrucción presentada como original. El repositorio ya es accesible; falta enviar su enlace con asunto exacto `Challenge IA`. No se exige despliegue, autenticación, multiagente ni más estética.

No se efectuó revisión visual de la interfaz en esta auditoría. Los resultados automáticos y las comprobaciones HTTP se registran en `verificacion.md` y no se atribuyen al usuario.

Verificación adicional de reproducción: se clonó `6fa2060` sin dependencias ni base local en `tmp/verificacion-limpia`, se ejecutó `npm ci` (101 paquetes instalados), `npm test` (16 aprobadas, 0 fallos) y `npm run build` (correcto). La copia usa exclusivamente los archivos versionados. Los cambios posteriores de esta preparación son documentales.

Ampliación documental por pedido del autor: README con subsecciones explícitas; [especificación](especificacion.md) propia con RF/RN/S/CA, casos de uso y esquema; [trazabilidad](trazabilidad.md) con funciones y pruebas exactas; [agente](agente.md), [API](api.md) y [retrospectiva](retrospectiva.md). Se mantiene la correspondencia R1–R8 y se explicita la diferencia entre comprobaciones automáticas, inspección de código y pasos manuales no informados. La secuencia de ejemplos API se ejecutó en memoria y sus respuestas están versionadas en evidencia/api-documentada.json. Esta mejora documental no recupera la historia Git ausente ni representa una nueva aceptación humana.
