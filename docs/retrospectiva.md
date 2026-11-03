# Retrospectiva y organización documental

## 1. Resultado construido

Web local TypeScript/React/Express, SQLite, inventario de cinco unidades, disponibilidad, creación, cancelación e historial. Un comando compila y sirve todo. Se incorporaron las reglas horarias pedidas por el autor y ocho ejemplos reproducibles. Hay 16 pruebas automáticas y verificación desde copia limpia.

Las tres delegaciones reales, corrección inicial y aceptación posterior están en [episodios](episodios.md). Esta retrospectiva resume el registro existente; no agrega opiniones, revisiones ni pruebas atribuidas al autor.

## 2. Qué dio evidencia útil

- Compartir validación y consulta de conflictos permitió comprobar consultas y reservas con las mismas reglas.
- Usar reloj controlado reprodujo horarios pasados de hoy y el cambio de día UTC/Argentina.
- Probar persistencia con dos procesos evitó depender solo de una comprobación de memoria.
- La carga demo facilita explorar la web, mientras que las pruebas siguen usando bases independientes.
- La aceptación humana se pidió explícitamente y quedó acompañada de motivos reales.
- El clon limpio verificó que dependencias/base local no fueran necesarias para reproducir el proyecto.

## 3. Dificultades y límites reales

- Git se inició tarde: captura el estado ya corregido y las etapas posteriores, sin la implementación anterior. No se fabrican commits iniciales.
- Computer Use no pudo verificar con confianza la URL del navegador en Windows y detuvo la revisión visual. No se declara un recorrido visual exitoso.
- Hubo fallos intermedios de pruebas por comparación de objetos SQLite y codificación de una expresión regular; se corrigieron y repitieron las verificaciones. Están registrados en verificacion.md.
- Un arranque auxiliar del agente apuntó a una ruta inexistente de npm-cli.js; se corrigió usando la instalación comprobada. No era un fallo del comando normal del usuario.
- La carga demo no es una transacción única y no está pensada para recuperación automática ante interrupción.

## 4. Comparación con los proyectos suministrados

Para esta ampliación se inspeccionaron los siguientes ZIP locales sin modificarlos:

| Referencia | Organización observada | Adaptación realizada aquí |
| --- | --- | --- |
| challenge-reservas-master.zip | README con subsecciones numeradas, requisitos, reglas, supuestos, aceptación, ejemplos y episodios. | README de cuatro secciones con subsecciones explícitas y tablas. |
| lab-reservas_TopicosAVANZADOS-main.zip | docs/especificacion.md, agente.md, decisiones, episodios, evidencia, progreso y retrospectiva. | Especificación y preparación del agente propias, más trazabilidad y retrospectiva. Se conservan los registros de evidencia ya existentes. |
| lab-reservations-agents-main.zip | Web, contratos API, instalación, datos, controles y registro de decisiones. | Guía de uso web y API documentada con rutas/estados reales de esta implementación. |
| reservas_laboratorio-main.zip | RF/RN/S/CA, modelo SQLite, versiones y procedimiento de persistencia. | Identificadores propios, modelo SQLite real y separación de procedimiento esperado y resultados observados. |

No se importan código, autores, modelos, commits, resultados de pruebas ni decisiones humanas de esas referencias. Tampoco sus reglas particulares: esta web tiene otra tecnología, formato de entrada, cancelación idempotente, jornada operativa y conservación de bases. No utiliza CLI Python, reset destructivo, timestamps de cancelación ni servicios que no se hayan usado.

## 5. Qué se mejoró en esta ampliación

Los requisitos ya existían como R1–R8 en el README. Se hicieron más visibles y completos con RF, RN, S y CA, manteniendo la correspondencia histórica. Se agregaron especificación independiente, matriz requisito/código/prueba, preparación detallada del agente y ejemplos de API. La ampliación es documental y no altera las reglas de la aplicación.

## 6. Estado de entrega

Repositorio público, rama master, autor identificado y decisiones humanas registradas. El envío del enlace por correo sigue pendiente. Se declara la limitación de historia Git inicial y la falta de un recorrido visual completo informado. La documentación permite evaluar la evidencia que sí existe y reproducir las pruebas sin una cuenta de IA.
