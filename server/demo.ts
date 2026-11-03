import { argentinaLocal } from '../shared/schedule.js';
import { Store } from './store.js';

const prefix = '[DEMO] ';
const examples = [
  { unit: 'MIC-01', requester: 'Grupo Alfa', start: '10:00', end: '11:00' },
  { unit: 'MIC-01', requester: 'Grupo Beta', start: '11:00', end: '12:00' },
  { unit: 'MIC-02', requester: 'Grupo Gamma', start: '10:00', end: '11:00' },
  { unit: 'OSC-01', requester: 'Grupo Delta', start: '09:00', end: '10:00', cancelled: true },
  { unit: 'MUL-01', requester: 'Grupo Epsilon', start: '14:00', end: '15:00' },
  { unit: 'FUE-01', requester: 'Grupo Zeta', start: '19:45', end: '20:00' },
  { unit: 'MIC-02', requester: 'Grupo Eta', start: '15:00', end: '16:00', cancelled: true },
  { unit: 'MIC-02', requester: 'Grupo Theta', start: '15:00', end: '16:00' },
];

// Explicit opt-in load. Never changes existing reservations or recreates cancelled examples.
export function seedDemo(store: Store, now = Date.now()) {
  const existing = store.list().filter(row => row.requester.startsWith(prefix));
  if (existing.length) return { created: 0, rows: existing, date: argentinaLocal(Math.min(...existing.map(row => row.start))).slice(0, 10) };

  // Start tomorrow in fixed UTC-03:00; find a day without conflicts with existing data.
  let date = '';
  for (let day = 1; day <= 366; day++) {
    const candidate = argentinaLocal(now + day * 86400000).slice(0, 10);
    if (examples.every(row => store.availability(row.unit, `${candidate}T${row.start}`, `${candidate}T${row.end}`).available)) {
      date = candidate;
      break;
    }
  }
  if (!date) throw new Error('No hay un día libre para los ejemplos en los próximos 366 días. No se modificaron reservas.');
  const rows = examples.map(example => {
    const row = store.create({ ...example, requester: prefix + example.requester, start: `${date}T${example.start}`, end: `${date}T${example.end}` });
    return example.cancelled ? store.cancel(String(row.id)) : row;
  });
  return { created: rows.length, rows, date };
}
