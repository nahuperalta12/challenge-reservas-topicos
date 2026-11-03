import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Store } from '../server/store.js';
import { seedDemo } from '../server/demo.js';

const now = Date.parse('2026-11-03T01:00:00Z'); // Still November 2 in Argentina.

test('ejemplos cubren conflictos, consecutivos, cancelación y reutilización sin duplicarse', t => {
  const store = new Store(':memory:', () => now);
  t.after(() => store.close());
  const result = seedDemo(store, now);
  assert.equal(result.date, '2026-11-03');
  assert.equal(result.created, 8);
  assert.equal(result.rows.filter(row => row.status === 'ACTIVA').length, 6);
  assert.equal(result.rows.filter(row => row.status === 'CANCELADA').length, 2);
  assert.equal(new Set(result.rows.map(row => row.unit)).size, 5);
  assert.equal(store.availability('MIC-01', '2026-11-03T10:30', '2026-11-03T11:30').available, false);
  assert.equal(store.availability('MIC-01', '2026-11-03T12:00', '2026-11-03T13:00').available, true);
  assert.equal(store.availability('OSC-01', '2026-11-03T09:00', '2026-11-03T10:00').available, true);
  assert.equal(store.availability('MIC-02', '2026-11-03T15:00', '2026-11-03T16:00').conflicts.length, 1);
  store.cancel(String(result.rows[0].id));
  const before = store.list();
  assert.equal(seedDemo(store, now).created, 0);
  assert.deepEqual(store.list(), before);
});

test('carga elige otra fecha si hay conflictos y conserva exactamente los registros anteriores', t => {
  const store = new Store(':memory:', () => now);
  t.after(() => store.close());
  const original = store.create({ unit: 'MIC-01', requester: 'Investigador ficticio previo', start: '2026-11-03T10:00', end: '2026-11-03T11:00' });
  const cancelled = store.cancel(String(store.create({ unit: 'OSC-01', requester: 'Cancelada previa', start: '2026-11-04T09:00', end: '2026-11-04T10:00' }).id));
  assert.equal(seedDemo(store, now).date, '2026-11-04');
  assert.deepEqual(store.list().find(row => row.id === original.id), original);
  assert.deepEqual(store.list().find(row => row.id === cancelled.id), cancelled);
  assert.equal(store.list().length, 10);
});
