import { resolve } from 'node:path';
import { Store } from './store.js';
import { seedDemo } from './demo.js';

const path = resolve(process.env.RESERVAS_DB || 'data/reservas.sqlite');
const store = new Store(path);
try {
  const result = seedDemo(store);
  console.log(JSON.stringify({ database: path, ...result }, null, 2));
} finally {
  store.close();
}
