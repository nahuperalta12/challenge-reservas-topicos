# Preparación de entrega

Autor confirmado por el usuario: **Nahuel Peralta**. Proyecto: LAB · Reservas de equipos. Rama: `master`. Esta guía no afirma que la entrega se haya realizado.

## Estado local

- Aplicación, inventario, pruebas, lockfile y documentación versionados.
- Tres episodios con decisión humana y motivo: `episodios.md`.
- Instalación limpia, 16 pruebas y build verificados: `verificacion.md`.
- Datos reproducibles con `npm run seed`; la base de uso se conserva localmente y no se publica.
- Limitación histórica declarada: el primer commit captura el sistema ya corregido; no existe en este Git la implementación anterior a las restricciones horarias. No se inventó ni reconstruyó como evidencia original.
- El usuario informó que todavía no subió el repositorio. No hay remoto configurado.

## Publicar conservando el historial

Crear en la cuenta elegida un repositorio vacío, por ejemplo `challenge-reservas-topicos`, sin inicializar README ni archivos. Si es privado, dar acceso efectivo al evaluador; comprobar permisos antes de enviar. La URL y la cuenta deben ser las elegidas por el autor. Ejecutar desde esta carpeta, reemplazando la URL de ejemplo:

```sh
git remote add origin https://github.com/TU_USUARIO/challenge-reservas-topicos.git
git push -u origin master
git rev-parse HEAD
```

No usar la URL de ejemplo literalmente. Para crear/publicar mediante el agente falta que el usuario indique su cuenta o destino y que GitHub esté conectado. El ZIP de código por sí solo no conserva el historial: publicar desde este repositorio local o restaurar el bundle preparado.

## Comprobar el repositorio remoto

Abrir el enlace con el acceso que tendrá el evaluador. Clonar el remoto en otra carpeta, con Node 24.15 o posterior:

```sh
npm ci
npm test
npm run build
npm run seed
npm start
```

Abrir http://localhost:3000. Confirmar el commit con `git rev-parse HEAD`. Estos comandos sobre el remoto no se ejecutaron porque aún no existe; la reproducción desde un clon local sí fue verificada.

## Borrador de correo — no enviado

Destinatario indicado en la consigna: `dgaifirst@gmail.com`.

Asunto exacto: `Challenge IA`.

```text
Hola:

Soy Nahuel Peralta. Comparto el repositorio del sistema local de reservas de equipos:

[REEMPLAZAR POR EL ENLACE REAL Y COMPROBAR SU ACCESO]

Rama: master
Commit: [REEMPLAZAR POR git rev-parse HEAD]

El README incluye instalación, ejecución, reglas y enlaces a las pruebas,
decisiones y los tres episodios de delegación. Se declara la limitación
histórica de Git en la documentación.

Saludos,
Nahuel Peralta
```

El borrador queda pendiente de completar con enlace/commit reales y de enviar por instrucción del autor. No se adjuntan credenciales, conversaciones completas ni bases de uso.
