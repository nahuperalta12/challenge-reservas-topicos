import { inventory } from '../shared/types.js';
import { OPEN_MINUTE, CLOSE_MINUTE, SLOT_MINUTES } from '../shared/schedule.js';
export class AppError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
// The API accepts Argentine wall-clock time, independently of the host timezone.
export function parseLocal(value: unknown): number {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value))
    throw new AppError('Ingresá una fecha y hora válidas (AAAA-MM-DDTHH:mm).');
  const year = Number(value.slice(0, 4));
  const timestamp = Date.parse(value + ':00-03:00');
  if (year < 1900 || year > 9999 || !Number.isFinite(timestamp) ||
      new Date(timestamp - 3 * 3600000).toISOString().slice(0, 16) !== value)
    throw new AppError('La fecha o la hora no existe. Usá un año entre 1900 y 9999.');
  return timestamp;
}
export function validateInterval(unit: unknown, start: unknown, end: unknown, now = Date.now()) {
  if (typeof unit !== 'string' || !inventory.some(item => item.id === unit))
    throw new AppError('Seleccioná una unidad del inventario.');
  const from = parseLocal(start), to = parseLocal(end);
  if (from >= to) throw new AppError('El inicio debe ser anterior al fin.');
  const startText = start as string, endText = end as string;
  if (startText.slice(0, 10) !== endText.slice(0, 10))
    throw new AppError('La reserva debe comenzar y terminar el mismo día.');
  for (const value of [startText, endText]) {
    const minute = Number(value.slice(11, 13)) * 60 + Number(value.slice(14, 16));
    if (minute < OPEN_MINUTE || minute > CLOSE_MINUTE)
      throw new AppError('Los horarios deben estar entre las 06:00 y las 20:00.');
    if (minute % SLOT_MINUTES !== 0)
      throw new AppError('Seleccioná minutos en intervalos de 15: 00, 15, 30 o 45.');
  }
  if (from < now) throw new AppError('El inicio no puede ser una fecha u hora que ya pasó (hora de Argentina).');
  return { unit, start: from, end: to };
}
export function validateRequester(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) throw new AppError('Ingresá un solicitante ficticio.');
  if (value.trim().length > 120) throw new AppError('El solicitante admite hasta 120 caracteres.');
  return value.trim();
}
