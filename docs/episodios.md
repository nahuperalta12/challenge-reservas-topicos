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

## Episodio 3

PENDIENTE DE OCURRIR. Debe surgir de una nueva delegación real y su revisión humana; no es evidencia completada.
