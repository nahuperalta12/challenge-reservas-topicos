import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { Store } from '../server/store.js';
import { createApp } from '../server/app.js';
import { initialInterval, timeSlots } from '../shared/schedule.js';
import { parseLocal, validateInterval } from '../server/domain.js';
const base = { unit: 'MIC-01', requester: 'Investigador A', start: '2099-11-03T10:00', end: '2099-11-03T11:00' };
function memory(t: { after: (fn: () => void) => void }) { const store = new Store(':memory:'); t.after(() => store.close()); return store; }
test('creación válida, solicitante normalizado e identificador', t => {
  const row = memory(t).create({ ...base, requester: '  Investigador A  ' });
  assert.equal(row.id, 1); assert.equal(row.status, 'ACTIVA'); assert.equal(row.requester, 'Investigador A');
  assert.equal(row.start, Date.parse('2099-11-03T13:00:00Z'));
});
test('rechaza toda superposición activa y disponibilidad coincide', t => {
  const store = memory(t); store.create(base);
  for (const [start, end] of [['10:30', '11:30'], ['09:30', '10:30'], ['10:15', '10:45'], ['09:00', '12:00'], ['10:00', '11:00']]) {
    const input = { ...base, start: '2099-11-03T' + start, end: '2099-11-03T' + end };
    assert.equal(store.availability(input.unit, input.start, input.end).available, false);
    assert.throws(() => store.create(input), /reserva activa/);
  }
  assert.equal(store.list().length, 1);
});
test('permite límites consecutivos en ambos extremos', t => {
  const store = memory(t); store.create(base);
  store.create({ ...base, start: '2099-11-03T11:00', end: '2099-11-03T12:00' });
  store.create({ ...base, start: '2099-11-03T09:00', end: '2099-11-03T10:00' });
  assert.equal(store.list().length, 3);
});
test('permite unidades distintas en el mismo horario', t => {
  const store = memory(t); store.create(base); store.create({ ...base, unit: 'MIC-02' });
  assert.equal(store.list().length, 2);
});
test('valida unidad, solicitante, fechas inexistentes, formato y orden', t => {
  const store = memory(t);
  for (const update of [{ unit: 'XXX' }, { requester: '' }, { requester: '   ' }, { requester: 2 }, { start: '2026-02-30T10:00' }, { start: '2099-11-03T24:00' }, { start: 'ayer' }, { end: base.start }, { end: '2099-11-03T09:00' }, { start: null }, { requester: 'A'.repeat(121) }])
    assert.throws(() => store.create({ ...base, ...update }));
  assert.equal(store.list().length, 0);
  assert.throws(() => store.availability('XXX', base.start, base.end));
  assert.throws(() => store.availability(base.unit, base.end, base.start));
});
test('valida calendario y años bisiestos sin depender de la zona del host', () => {
  assert.equal(parseLocal('2028-02-29T23:59'), Date.parse('2028-03-01T02:59:00Z'));
  for (const value of ['2027-02-29T10:00','2026-04-31T10:00','2026-13-01T10:00','2026-00-01T10:00','2099-11-03T10:60','1899-01-01T10:00']) assert.throws(() => parseLocal(value));
});
test('cancelación conserva todos los datos y libera el intervalo; repetir es idempotente', t => {
  const store = memory(t); const row = store.create(base);
  assert.deepEqual({ ...store.cancel(String(row.id)) }, { ...row, status: 'CANCELADA' });
  assert.deepEqual({ ...store.cancel(String(row.id)) }, { ...row, status: 'CANCELADA' });
  assert.equal(store.availability(base.unit, base.start, base.end).available, true);
  assert.equal(store.create(base).id, 2); assert.equal(store.list().length, 2);
  assert.throws(() => store.cancel('999'), /No existe/); assert.throws(() => store.cancel('1abc'), /identificador/);
});
test('rechaza horarios pasados hoy y d?as anteriores usando hora argentina', t => {
  const now = Date.parse('2026-11-02T17:00:00-03:00');
  const store = new Store(':memory:', () => now); t.after(() => store.close());
  for (const [start, end] of [['2026-11-02T13:30', '2026-11-02T14:00'], ['2026-11-01T18:00','2026-11-01T19:00']]) {
    assert.throws(() => store.create({ ...base, start, end }), /ya pas?/);
    assert.throws(() => store.availability(base.unit, start, end), /ya pas?/);
  }
  assert.equal(store.create({ ...base, start: '2026-11-02T17:15', end: '2026-11-02T17:30' }).status, 'ACTIVA');
  assert.equal(store.create({ ...base, start: '2026-11-03T06:00', end: '2026-11-03T06:15' }).status, 'ACTIVA');
});
test('respeta segundos transcurridos y cambio de d?a argentino', () => {
  assert.throws(() => validateInterval(base.unit, '2026-11-02T17:00', '2026-11-02T17:15', Date.parse('2026-11-02T17:00:01-03:00')), /ya pas?/);
  assert.doesNotThrow(() => validateInterval(base.unit, '2026-11-03T06:00', '2026-11-03T06:15', Date.parse('2026-11-03T01:00:00Z')));
});
test('acepta apertura 06:00, cierre 20:00 y ?ltimo turno 19:45', t => {
  const store = memory(t);
  store.create({ ...base, start: '2099-11-03T06:00', end: '2099-11-03T06:15' });
  store.create({ ...base, start: '2099-11-03T19:45', end: '2099-11-03T20:00' });
  assert.equal(store.list().length, 2);
});
test('rechaza fuera de horario, minutos intermedios y reservas nocturnas en ambas operaciones', t => {
  const store = memory(t);
  for (const [start, end, message] of [
    ['2099-11-03T05:45','2099-11-03T06:15', /06:00/],
    ['2099-11-03T19:45','2099-11-03T20:15', /20:00/],
    ['2099-11-03T06:01','2099-11-03T07:00', /15/],
    ['2099-11-03T06:00','2099-11-03T07:10', /15/],
    ['2099-11-03T19:45','2099-11-04T06:15', /mismo/],
    ['2099-11-03T20:00','2099-11-03T20:15', /20:00/],
  ] as const) {
    assert.throws(() => store.create({ ...base, start, end }), message);
    assert.throws(() => store.availability(base.unit, start, end), message);
  }
});
test('selector ofrece cuartos de hora y sugiere un intervalo futuro dentro de horario', () => {
  assert.equal(timeSlots[0], '06:00'); assert.equal(timeSlots.at(-1), '20:00'); assert.equal(timeSlots.length, 57);
  assert.ok(timeSlots.every(time => ['00','15','30','45'].includes(time.slice(3))));
  for (const [clock, expected] of [
    ['2026-11-02T05:00:00-03:00', '2026-11-02T06:00'],
    ['2026-11-02T17:00:00-03:00', '2026-11-02T17:15'],
    ['2026-11-02T19:44:00-03:00', '2026-11-02T19:45'],
    ['2026-11-02T19:45:00-03:00', '2026-11-03T06:00'],
    ['2026-12-31T23:00:00-03:00', '2027-01-01T06:00']
  ]) {
    const now = Date.parse(clock), input = initialInterval(now);
    assert.equal(input.start, expected);
    assert.doesNotThrow(() => validateInterval(base.unit, input.start, input.end, now));
  }
});
test('API: inventario, entradas inválidas, conflicto concurrente y cancelación', async t => {
  const store = memory(t); const server = createApp(store).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => new Promise<void>((resolve, reject) => server.close(e => e ? reject(e) : resolve())));
  const address = server.address(); if (!address || typeof address === 'string') throw new Error('Sin puerto');
  const url = `http://127.0.0.1:${address.port}/api`;
  const post = (body: unknown) => fetch(url + '/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  assert.equal((await (await fetch(url + '/inventory')).json()).length, 5);
  for (const value of [null, [], {}, { ...base, requester: ' ' }, { ...base, start: '2000-01-01T13:30', end: '2000-01-01T14:00' }, { ...base, start: '2099-11-03T05:45' }, { ...base, end: '2099-11-03T11:05' }]) assert.equal((await post(value)).status, 400);
  const responses = await Promise.all([post(base), post(base)]);
  assert.deepEqual(responses.map(r => r.status).sort(), [201, 409]);
  const created = await responses.find(r => r.status === 201)!.json();
  assert.equal((await fetch(`${url}/availability?${new URLSearchParams({ unit: base.unit, start: base.start, end: base.end })}`)).status, 200);
  assert.equal((await fetch(`${url}/reservations/${created.id}/cancel`, { method: 'POST' })).status, 200);
  assert.equal((await post(base)).status, 201);
  const list = await (await fetch(url + '/reservations')).json();
  assert.equal(list.length, 2); assert.ok(list.some((r: { status: string }) => r.status === 'CANCELADA'));
  assert.equal((await fetch(url + '/missing')).status, 404);
  assert.equal((await fetch(url + '/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' })).status, 400);
});
test('persistencia real entre procesos: conserva activa/cancelada y disponibilidad', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'lab-reservas-')); const db = join(dir, 'reservas.sqlite');
  async function run(code: string) {
    const child = spawn(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', code], { cwd: process.cwd(), env: { ...process.env, TEST_DATABASE: db }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '', errors = ''; child.stdout.on('data', d => output += d); child.stderr.on('data', d => errors += d);
    const [status] = await once(child, 'close'); assert.equal(status, 0, errors); return output.trim();
  }
  try {
    await run(`import { Store } from './server/store.ts'; const s = new Store(process.env.TEST_DATABASE); const a = s.create(${JSON.stringify(base)}); s.cancel(String(a.id)); s.create(${JSON.stringify({ ...base, unit: 'MIC-02' })}); s.close();`);
    const result = JSON.parse(await run(`import { Store } from './server/store.ts'; const s = new Store(process.env.TEST_DATABASE); console.log(JSON.stringify({ rows: s.list(), free: s.availability('MIC-01','${base.start}','${base.end}').available, busy: s.availability('MIC-02','${base.start}','${base.end}').available })); s.close();`));
    assert.equal(result.rows.length, 2); assert.deepEqual(result.rows.map((r: { status: string }) => r.status).sort(), ['ACTIVA', 'CANCELADA']);
    assert.equal(result.free, true); assert.equal(result.busy, false);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
