# Verificación

Entorno observado: Windows/PowerShell, Node v24.15.0, npm 11.12.1, Git 2.46.0.windows.1.

## Verificación del agente

Primera versión: `npm test` pasó con 10 pruebas, y `npm run build` completó tipos y compilación. Hubo un fallo inicial por comparar el prototipo del objeto SQLite; se corrigió la comparación de datos y se repitió la suite. `npm start` sirvió la página con HTTP 200 y título correcto. La revisión visual no se completó: Computer Use se detuvo por no poder verificar con suficiente confianza la URL del navegador en Windows.

Corrección de horarios (episodio 2): `npm test` pasó con **14 pruebas, 0 fallos** y `npm run build` terminó correctamente. Se cubren apertura 06:00, cierre 20:00, último turno 19:45, rechazo fuera de ventana, minutos no múltiplos de 15 y reservas que atraviesan el cierre. Con reloj controlado a las 17:00 del 02/11/2026 se rechazan las 13:30 de hoy y días anteriores, y se aceptan 17:15 de hoy y 06:00 del día siguiente. También se prueba el segundo posterior al inicio y el cambio de día UTC/Argentina. Continúan pasando conflicto, cancelación, API y persistencia entre procesos. Un fallo intermedio fue una expresión regular de prueba alterada por la codificación de consola; se corrigió y se repitieron los comandos.

Estos resultados son del agente. No constituyen revisión humana ni comprobación visual del selector.

## Procedimiento humano reproducible (pendiente)

1. Ejecutar `npm ci` y `npm start`; abrir http://localhost:3000.
2. Elegir MIC-01, una fecha futura libre (por ejemplo mañana), inicio 10:00 y fin 11:00, solicitante ficticio Investigador A. Crear: debe aparecer una reserva activa con ID. Usar la misma fecha en los pasos siguientes.
3. Consultar y reservar MIC-01 de 10:30 a 11:30: debe indicar ocupado y rechazar creación.
4. Reservar MIC-01 de 11:00 a 12:00: debe aceptar. Reservar MIC-02 de 10:00 a 11:00: debe aceptar.
5. Cancelar la primera reserva desde su fila y confirmar: debe conservarse como cancelada. Consultar MIC-01 de 10:00 a 11:00: debe estar disponible.
6. Detener con Ctrl+C y volver a ejecutar `npm start` sin cambiar la base: deben conservarse reservas activas y canceladas con los mismos ID y datos.
7. Registrar resultados observados y decidir si se acepta, corrige o rechaza. Si ya existían reservas de prueba, elegir otra fecha libre o una base distinta antes del procedimiento.
8. Comprobar que los selectores ofrecen solo 00/15/30/45, desde 06:00 hasta 20:00; el inicio llega hasta 19:45 y el fin hasta 20:00. Para hoy, los inicios pasados deben estar deshabilitados. Intentar enviar horarios pasados o minutos no permitidos por la API: debe devolver 400 sin guardar reservas.

Resultado humano observado: PENDIENTE. No se atribuye esta comprobación al usuario.
