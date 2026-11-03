# Instrucciones del proyecto

- Leer README.md y docs/PROGRESO.md antes de modificar el sistema.
- Mantener una web local iniciada con `npm start`, con persistencia SQLite.
- Usar la misma validación de intervalo para consultar y reservar; intervalos [inicio, fin).
- Interpretar siempre las entradas como hora argentina UTC-03:00; no usar la zona del equipo.
- Las cancelaciones conservan identificador y datos. No borrar bases existentes.
- Registrar decisiones y resultados reales. No atribuir al usuario revisiones que no realizó.
- Ejecutar `npm test` y `npm run build` después de cambios funcionales.
- Mantener progreso versionable. No publicar, enviar correos ni hacer push sin instrucción del usuario.
