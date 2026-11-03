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

## 2026-11-02 · Revisión humana y preparación de entrega

- Autor confirmado por el usuario: Nahuel Peralta. Informó que aún no subió el repositorio.
- El autor explicó los motivos de los episodios 2 y 3 y luego confirmó expresamente: «Acepto ambos resultados por los motivos que expliqué». Se registró ACEPTAR en ambos, con sus motivos, sin atribuirle pasos manuales que no informó.
- Se clonó el commit `6fa2060` en `tmp/verificacion-limpia` sin dependencias ni base. `npm ci` correcto, 16 pruebas aprobadas y build correcto. El código funcional no cambió en esta preparación.
- Se corrigió el arranque auxiliar del agente: un intento usó una ruta inexistente a npm-cli.js y falló. Luego se usó la instalación real de npm, y `npm start` compiló y dejó el servicio local respondiendo HTTP 200.
- La base principal contiene ahora diez reservas: siete activas y tres canceladas. No se modificó ninguna en esta preparación; no se atribuye a esta observación un recorrido de prueba humano.
- El intento de revisión visual del agente volvió a detenerse porque Computer Use no pudo verificar la URL en Windows. No se insistió ni se declara esa revisión completada.
- Se preparó `docs/entrega.md` con procedimiento de publicación y borrador de correo no enviado. La conexión GitHub fue sugerida; no está confirmada. Se prepara copia de código y bundle con historial bajo `tmp/entrega` (excluidos de Git).
- Pendientes: evidencia histórica anterior al primer commit si existe, cuenta/repositorio remoto, comprobación de acceso y envío de enlace. La aceptación humana de los episodios 2 y 3 y la identificación del autor ya están completas.
