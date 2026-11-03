export const inventory = [
  { id: 'MIC-01', name: 'Microscopio digital', category: 'Óptica', symbol: '◉' },
  { id: 'MIC-02', name: 'Microscopio digital', category: 'Óptica', symbol: '◉' },
  { id: 'OSC-01', name: 'Osciloscopio', category: 'Medición', symbol: '∿' },
  { id: 'MUL-01', name: 'Multímetro', category: 'Medición', symbol: 'Ω' },
  { id: 'FUE-01', name: 'Fuente de alimentación', category: 'Energía', symbol: 'ϟ' },
] as const;
export interface Reservation {
  id: number; unit: string; requester: string; start: number; end: number;
  status: 'ACTIVA' | 'CANCELADA';
}
export interface ReservationInput { unit: string; requester: string; start: string; end: string }
