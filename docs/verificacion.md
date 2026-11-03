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

Ejecución humana de este procedimiento paso a paso: NO INFORMADA. El autor aceptó posteriormente los resultados de los episodios 2 y 3 con motivos (ver registro siguiente); no se atribuye por eso la ejecución de estos pasos al usuario.

## Auditoría y carga de datos · Episodio 3 · 2026-11-02

- `npm.cmd test`: **16 pruebas aprobadas, 0 fallos**, incluidas las 14 anteriores y dos de la carga demo. Comprueban seis activos/dos cancelados, cinco unidades, conflictos, consecutivos, horario liberado y vuelto a reservar, repetición sin reactivar cancelaciones y conservación exacta de registros previos activos/cancelados en un día con conflictos. La prueba de persistencia entre procesos sigue aprobada.
- `npm.cmd run build`: tipos TypeScript y compilación Vite correctos.
- `npm.cmd run seed`: base local inicialmente vacía; ocho reservas creadas, fecha argentina 2026-11-03. Repetición real: cero creadas, mismos ocho ID y estados.
- `npm.cmd start`: compiló e inició web/API en 127.0.0.1:3000. Proceso dejado en ejecución para revisión.
- Comprobación con `node --input-type=module -e` y `fetch` sobre el servidor local: página HTTP 200; inventario de cinco unidades; historial de ocho registros, seis activos y dos cancelados. `/api/availability`, fecha 2026-11-03: MIC-01 10:30–11:30 ocupado; MIC-01 12:00–13:00 libre; OSC-01 09:00–10:00 libre; MIC-02 15:00–16:00 ocupado por la nueva reserva activa. Todas coincidieron con lo esperado.
- No se ejecutó revisión visual ni revisión humana del resultado. No se realizó entrega externa. La carga de ejemplos no sustituye las pruebas automáticas y no se usa como base de esas pruebas.

## Reproducción limpia y aceptación posterior · 2026-11-02

Entorno comprobado nuevamente: Node v24.15.0, npm 11.12.1 y Git 2.46.0.windows.1.

1. `git clone --no-local . tmp/verificacion-limpia`: correcto, commit de código `6fa2060`. La copia no incluye node_modules, dist ni la base de uso.
2. En esa copia, `npm.cmd ci`: 101 paquetes instalados, salida 0; auditoría de npm informó cero vulnerabilidades en ese momento.
3. En esa copia, `npm.cmd test`: 16 aprobadas, cero fallos, incluidas API y persistencia entre procesos.
4. En esa copia, `npm.cmd run build`: TypeScript correcto y Vite compiló 17 módulos.
5. Aplicación principal: `npm start` ejecutado mediante la instalación real de npm con ventana oculta, compilación correcta y servicio en 127.0.0.1:3000. `fetch` confirmó HTTP 200 y diez reservas (siete activas y tres canceladas). Se preservó la base sin escribir sobre sus registros.

Fallo real del arranque auxiliar anterior: se intentó invocar una ruta a npm-cli.js dentro de las dependencias del proyecto, donde no existe. Se corrigió usando la instalación global comprobada. No es un fallo de `npm start` ejecutado normalmente por el usuario.

Revisión visual del agente: no completada. La herramienta detuvo Computer Use por no poder determinar la URL actual con suficiente confianza; no se continuó la automatización de UI en ese turno.

Revisión humana posterior: Nahuel Peralta confirmó «Acepto ambos resultados por los motivos que expliqué», referida explícitamente a episodios 2 y 3. Motivos registrados en `episodios.md`. No informó resultados paso a paso de la guía manual y no se los atribuye. Las modificaciones posteriores a la reproducción limpia son documentales, sin cambio funcional.
