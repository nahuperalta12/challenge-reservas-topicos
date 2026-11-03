# Episodios reales

## 1 · Primera versión local (2026-11-02)

- **Objetivo / requisito:** construir una web local para el challenge, R1–R8.
- **Contexto:** consigna PDF, tres proyectos completos de referencia y preferencias de interfaz/tecnología.
- **Extracto humano:** «web local con interfaz visual entrando por npm start»; «el que mejor se adapte al proyecto».
- **Acción del agente:** especificación, implementación propia, interfaz, persistencia, pruebas y documentación. Evidencia: `package.json`, `src/`, `server/`, `tests/` y registro de verificaciones.
- **Decisión humana:** CORREGIR reglas de horarios: el usuario pidió apertura/cierre, cuartos de hora y rechazo de inicios pasados. Motivo explícito: si son las 17:00, no debe poder registrarse una reserva de las 13:30 de ese día. No implica aceptación del resto de la aplicación ni una prueba manual informada.
- **Versión:** package.json 0.1.0; asociar al commit real al versionar.

## 2 · Restricciones horarias solicitadas por el usuario

- **Objetivo / requisito:** corregir validaciones de creación y disponibilidad y selección visual.
- **Contexto:** implementación inicial y revisión humana con tres restricciones nuevas.
- **Extractos humanos:** «horarios sean de 6am y como maximo 8pm», «minutos de a 15 (00,15,30,45)» y «no se puede hacer una reserva de un horario que ya paso».
- **Acción del agente:** validación compartida 06:00–20:00 en una jornada, selectores con minutos válidos, rechazo de pasado usando instante actual y pruebas con reloj controlado para reproducir el ejemplo de las 17:00.
- **Evidencia:** `shared/schedule.ts`, `server/domain.ts`, `server/store.ts`, `src/main.tsx`, `tests/reservations.test.ts`, `docs/verificacion.md`.
- **Decisión humana sobre esta corrección:** PENDIENTE. No se atribuye aceptación automática.

## 3 · Auditoría de requisitos y datos de ejemplo (2026-11-02)

- **Objetivo / requisito:** contrastar el proyecto con la consigna y disponer de registros reproducibles para probar R1–R8.
- **Contexto:** código actual, README, progreso, pruebas, base local vacía y consigna original `challenge-agents.pdf` de tres páginas.
- **Extracto humano:** «este proyecto cuample con tos los requisitos solicitaos? no existen registros cargados, tambien podrias rellenar algunos como para cumplir con las pruebas y todo lo que se solicite».
- **Acción del agente:** auditoría documentada, comando de carga explícita `npm run seed`, ocho registros ficticios, pruebas de la carga y conservación de registros anteriores; inicialización local de Git sin publicar.
- **Evidencia:** `server/demo.ts`, `server/seed.ts`, `tests/demo.test.ts`, `docs/auditoria.md`, `docs/datos-demo.md` y `docs/verificacion.md`. El commit `0a27447` captura el estado recibido antes del cambio; la versión del episodio se identifica con el commit que agrega estos archivos en `git log`.
- **Decisión humana sobre este resultado:** PENDIENTE. La solicitud es una delegación real, no una aceptación de los resultados de los episodios 2 o 3. Debe registrarse la decisión y su motivo cuando el usuario efectivamente los comunique.
