export const OPEN_MINUTE = 6 * 60;
export const CLOSE_MINUTE = 20 * 60;
export const SLOT_MINUTES = 15;
export function argentinaLocal(timestamp: number): string {
  return new Date(timestamp - 3 * 3600000).toISOString().slice(0, 16);
}
export const timeSlots = Array.from({ length: (CLOSE_MINUTE - OPEN_MINUTE) / SLOT_MINUTES + 1 }, (_, index) => {
  const minute = OPEN_MINUTE + index * SLOT_MINUTES;
  return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(minute % 60).padStart(2, '0')}`;
});
export function initialInterval(now = Date.now()) {
  const next = Math.ceil((now + 1) / (SLOT_MINUTES * 60000)) * SLOT_MINUTES * 60000;
  let start = argentinaLocal(next);
  if (start.slice(11) < '06:00') start = start.slice(0, 10) + 'T06:00';
  if (start.slice(11) >= '20:00') start = argentinaLocal(next + 86400000).slice(0, 10) + 'T06:00';
  const end = argentinaLocal(Date.parse(start + ':00-03:00') + SLOT_MINUTES * 60000);
  return { start, end };
}
