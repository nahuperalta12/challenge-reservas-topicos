import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { AppError, validateInterval, validateRequester } from './domain.js';
import type { Reservation } from '../shared/types.js';
export class Store {
  private db: DatabaseSync;
  constructor(path: string, private clock: () => number = Date.now) {
    if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
    this.db = new DatabaseSync(path);
    this.db.exec(`PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS reservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT, unit TEXT NOT NULL,
        requester TEXT NOT NULL, start INTEGER NOT NULL, end INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('ACTIVA','CANCELADA')), CHECK(start < end));
      CREATE INDEX IF NOT EXISTS reservations_interval ON reservations(unit, status, start, end);`);
  }
  list(): Reservation[] {
    return this.db.prepare('SELECT * FROM reservations ORDER BY start DESC, id DESC').all() as unknown as Reservation[];
  }
  availability(unit: unknown, start: unknown, end: unknown) {
    const interval = validateInterval(unit, start, end, this.clock());
    const conflicts = this.db.prepare(`SELECT * FROM reservations
      WHERE unit=? AND status='ACTIVA' AND start < ? AND end > ? ORDER BY start`)
      .all(interval.unit, interval.end, interval.start) as unknown as Reservation[];
    return { available: conflicts.length === 0, conflicts };
  }
  create(input: Record<string, unknown>): Reservation {
    const interval = validateInterval(input.unit, input.start, input.end, this.clock());
    const requester = validateRequester(input.requester);
    // Acquire the write lock before checking: two writers cannot both accept a conflict.
    this.db.exec('BEGIN IMMEDIATE');
    try {
      if (!this.availability(input.unit, input.start, input.end).available)
        throw new AppError('La unidad ya tiene una reserva activa en ese horario.', 409);
      const result = this.db.prepare(`INSERT INTO reservations(unit,requester,start,end,status)
        VALUES(?,?,?,?,'ACTIVA')`).run(interval.unit, requester, interval.start, interval.end);
      const reservation = this.db.prepare('SELECT * FROM reservations WHERE id=?').get(Number(result.lastInsertRowid));
      this.db.exec('COMMIT');
      return reservation as unknown as Reservation;
    } catch (error) { this.db.exec('ROLLBACK'); throw error; }
  }
  cancel(id: string): Reservation {
    if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) throw new AppError('El identificador no es válido.');
    const row = this.db.prepare('SELECT * FROM reservations WHERE id=?').get(Number(id));
    if (!row) throw new AppError('No existe esa reserva.', 404);
    this.db.prepare("UPDATE reservations SET status='CANCELADA' WHERE id=?").run(Number(id));
    return this.db.prepare('SELECT * FROM reservations WHERE id=?').get(Number(id)) as unknown as Reservation;
  }
  close() { this.db.close(); }
}
