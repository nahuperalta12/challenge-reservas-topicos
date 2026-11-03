# Preparación de entrega

Autor confirmado por el usuario: **Nahuel Peralta**. Proyecto: LAB · Reservas de equipos. Rama: `master`. Esta guía no afirma que la entrega se haya realizado.

Repositorio público creado por instrucción del autor: https://github.com/nahuperalta12/challenge-reservas-topicos. Historial subido a `master`; acceso público sin autenticación comprobado. El envío del correo sigue pendiente.

## Estado local

- Aplicación, inventario, pruebas, lockfile y documentación versionados.
- Tres episodios con decisión humana y motivo: `episodios.md`.
- Instalación limpia, 16 pruebas y build verificados: `verificacion.md`.
- Datos reproducibles con `npm run seed`; la base de uso se conserva localmente y no se publica.
- Limitación histórica declarada: el primer commit captura el sistema ya corregido; no existe en este Git la implementación anterior a las restricciones horarias. No se inventó ni reconstruyó como evidencia original.
- Remoto `origin` configurado en https://github.com/nahuperalta12/challenge-reservas-topicos.git y rama `master` publicada. La cuenta autenticada se comprobó como `nahuperalta12`; no se almacenan credenciales en el proyecto.

## Publicar conservando el historial

Crear en la cuenta elegida un repositorio vacío, por ejemplo `challenge-reservas-topicos`, sin inicializar README ni archivos. Si es privado, dar acceso efectivo al evaluador; comprobar permisos antes de enviar. La URL y la cuenta deben ser las elegidas por el autor. Ejecutar desde esta carpeta, reemplazando la URL de ejemplo:

```sh
git remote add origin https://github.com/TU_USUARIO/challenge-reservas-topicos.git
git push -u origin master
git rev-parse HEAD
```

Los comandos anteriores son una referencia para una instalación nueva; no repetir `remote add` en esta copia, que ya tiene `origin`. La publicación se realizó mediante la sesión existente de Git Credential Manager, sin instalar una integración adicional. El ZIP de código por sí solo no conserva el historial: usar el repositorio remoto o restaurar el bundle preparado.

## Comprobar el repositorio remoto

Abrir el enlace con el acceso que tendrá el evaluador. Clonar el remoto en otra carpeta, con Node 24.15 o posterior:

```sh
npm ci
npm test
npm run build
npm run seed
npm start
```

Abrir http://localhost:3000. Confirmar el commit con `git rev-parse HEAD`. La instalación y las pruebas se verificaron desde un clon local limpio; la publicación posterior cambió documentación, sin cambios funcionales. Se verificaron la página pública y la referencia remota de la rama, sin atribuir una segunda instalación desde el remoto.

## Borrador de correo — no enviado

Destinatario indicado en la consigna: `dgaifirst@gmail.com`.

Asunto exacto: `Challenge IA`.

```text
Hola:

Soy Nahuel Peralta. Comparto el repositorio del sistema local de reservas de equipos:

https://github.com/nahuperalta12/challenge-reservas-topicos

Rama: master
Commit: [REEMPLAZAR POR git rev-parse HEAD]

El README incluye instalación, ejecución, reglas y enlaces a las pruebas,
decisiones y los tres episodios de delegación. Se declara la limitación
histórica de Git en la documentación.

Saludos,
Nahuel Peralta
```

El borrador queda pendiente de completar con el commit actual y de enviar por instrucción del autor. El enlace real ya tiene acceso público comprobado. No se adjuntan credenciales, conversaciones completas ni bases de uso.
