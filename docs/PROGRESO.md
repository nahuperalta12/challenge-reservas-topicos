# Progreso

## 2026-11-02 · Primera construcción

- Usuario eligió web local, npm start y tecnología a criterio del agente.
- Carpeta de trabajo inicialmente vacía; referencias consultadas sin modificarlas.
- Especificación inicial, aplicación, pruebas y documentación creadas.
- No se inventan revisiones, correcciones humanas, commits ni sesiones anteriores.
- Próximo paso humano: probar interfaz, revisar reglas y aceptar/corregir/rechazar el resultado con un motivo.
- Pendientes de entrega: dos episodios nuevos, datos de autor, publicación Git y enlace final.

## Corrección solicitada por el usuario · Episodio 2

- Horario diario 06:00–20:00 y cuartos de hora.
- Se reemplaza el supuesto inicial de admitir fechas pasadas: ahora se rechazan en creación y disponibilidad.
- Interfaz con fecha y selectores horarios; valores iniciales futuros, incluso después del cierre.
- Historial previo conservado. Pendiente revisión humana de esta corrección y un tercer episodio real.

## 2026-11-02 · Auditoría y carga de ejemplos · Episodio 3

- Nueva delegación real del usuario: revisar cumplimiento y cargar registros para probar.
- Consigna original de tres páginas leída y contrastada en `docs/auditoria.md`.
- Base local comprobada vacía antes de cargar. `npm run seed` agregó ocho reservas ficticias para el 03/11/2026: seis activas y dos canceladas. Segunda ejecución agregó cero y conservó ID/datos/estados.
- Pruebas nuevas comprueban escenarios demo, zona argentina, conservación de datos anteriores y repetición sin duplicados. Suite completa: 16 aprobadas, 0 fallos. `npm run build` correcto.
- `npm start` dejó la web en http://localhost:3000. Página HTTP 200, cinco unidades, ocho reservas; consultas HTTP verificaron conflicto, límite libre, cancelación libre y reocupación.
- Git no existía. Se inicializó localmente y se guardó el estado recibido como `0a27447`; los cambios de esta auditoría quedan en el siguiente commit. Esto no reconstruye versiones originales anteriores al estado recibido ni revisiones humanas ausentes.
- Pendientes actuales: decisiones humanas con motivo sobre episodios 2 y 3, evidencia Git histórica anterior si existe, identificación del autor y entrega del repositorio accesible. No se publicó, hizo push ni envió correo.
