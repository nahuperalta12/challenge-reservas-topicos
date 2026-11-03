# Decisiones iniciales · 2026-11-02

| ID | Decisión y motivo | Alternativas y consecuencias |
| --- | --- | --- |
| D1 | Web local por pedido humano; arranque único con npm start. | Consola descartada por preferencia explícita. No requiere hosting. |
| D2 | TypeScript + React + Express: un lenguaje y separación interfaz/dominio/persistencia. | Python podría resolver dominio pero agregaría otro runtime para una interfaz React. Más dependencias que una consola, a cambio de la interfaz solicitada. |
| D3 | SQLite de Node: archivo local y transacciones sin instalar un motor externo. | JSON simplifica almacenamiento pero requiere implementar escrituras seguras; PostgreSQL exige servicio adicional. Se requiere Node 24.15+. |
| D4 | UTC-03:00 explícito en entradas; comparación numérica UTC. | Evita depender de la zona horaria del equipo. Si cambia la política horaria argentina, revisar conversión y presentación. |
| D5 | Permitir fechas pasadas y no limitar duración/anticipación. | La consigna no exige restricciones adicionales. Facilita reproducir ejemplos, pero no impide registrar turnos históricos. |
| D6 | No borrar reservas; cancelación idempotente. | Conserva historial. Reiniciar datos mediante otra ruta, manteniendo el archivo anterior. |
| D7 | Registrar una delegación inicial y dejar revisiones pendientes. | Dividir retrospectivamente una solicitud en tres falsearía los episodios. Quedan dos delegaciones reales por realizar. |

## Evolución por revisión humana

| ID | Decisión y motivo | Alternativas y consecuencias |
| --- | --- | --- |
| D8 | Sustituir D5: rechazar inicios pasados, incluso hoy, por pedido explícito del usuario. | El historial existente se conserva. Reloj del servidor como referencia; tests con reloj inyectado para no depender de la hora real. |
| D9 | Ventana diaria 06:00–20:00, minutos 00/15/30/45. | Selectores explícitos en vez de depender del comportamiento de datetime-local. Reservas en una sola jornada para no atravesar horas de cierre. Último turno 19:45–20:00. |
| D10 | Carga demo explícita mediante npm run seed, solicitantes ficticios [DEMO], fecha futura argentina y operaciones de Store. | No cargar al arrancar para evitar nuevas reservas inesperadas. La fecha se desplaza ante conflictos, no se alteran registros existentes. Si ya hay ejemplos, no se repiten ni reactivan. Se mantiene la base excluida de Git y se versiona el comando reproducible. |
| D11 | Inicializar Git y capturar primero el estado recibido antes de la auditoría. | No existía repositorio local. Permite recuperar esta evolución, pero no recupera la primera versión anterior ni demuestra revisiones humanas; ambas limitaciones quedan explícitas. Commits del agente con identidad Codex, sin atribuir autoría ni aceptación al usuario. |
