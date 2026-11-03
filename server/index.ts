import { resolve } from 'node:path';
import { createApp } from './app.js';
import { Store } from './store.js';
const port = Number(process.env.PORT || 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT debe estar entre 1 y 65535.');
const store = new Store(resolve(process.env.RESERVAS_DB || 'data/reservas.sqlite'));
const server = createApp(store).listen(port, '127.0.0.1', () => {
  console.log(`\n  LAB · Reservas de equipos\n  Abrí http://localhost:${port}\n  Ctrl+C para detener. Los datos se conservan.\n`);
});
server.on('error', error => { console.error('No se pudo iniciar el servidor:', error.message); store.close(); process.exitCode = 1; });
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => {
  server.close(() => { store.close(); process.exit(0); });
});
