import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { inventory, type Reservation, type ReservationInput } from '../shared/types';
import './style.css';
import { argentinaLocal, initialInterval, timeSlots } from '../shared/schedule';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch('/api' + path, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudo completar la operación.');
  return result;
}
const dateFormat = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', day: '2-digit', month: 'short', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('es-AR', { timeZone: 'America/Argentina/Buenos_Aires', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
function App() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [availability, setAvailability] = useState<{ available: boolean; conflicts: Reservation[] } | null>(null);
  const [unit, setUnit] = useState<string>('MIC-01');
  const [requester, setRequester] = useState('');
  const [initial] = useState(() => initialInterval());
  const [start, setStart] = useState(initial.start);
  const [end, setEnd] = useState(initial.end);
  const [clock, setClock] = useState(Date.now);
  useEffect(() => { const timer = setInterval(() => setClock(Date.now()), 15000); return () => clearInterval(timer); }, []);
  const [filter, setFilter] = useState('TODAS');
  const [search, setSearch] = useState('');
  const [cancelTarget, setCancelTarget] = useState<Reservation | null>(null);
  async function refresh() { setReservations(await request<Reservation[]>('/reservations')); }
  useEffect(() => { refresh().catch(e => setError(e.message)).finally(() => setLoading(false)); }, []);
  const active = reservations.filter(row => row.status === 'ACTIVA');
  const now = clock;
  const occupied = new Set(active.filter(row => row.start <= now && row.end > now).map(row => row.unit));
  const visible = reservations.filter(row => (filter === 'TODAS' || row.status === filter) &&
    `${row.id} ${row.unit} ${row.requester}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
  const input: ReservationInput = { unit, requester, start, end };
  function invalidate() { setAvailability(null); setNotice(''); setError(''); }
  async function check() {
    setBusy(true); setError(''); setNotice(''); setAvailability(null);
    try { setAvailability(await request('/availability?' + new URLSearchParams({ unit, start, end }))); }
    catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function reserve(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice(''); setAvailability(null);
    try {
      const row = await request<Reservation>('/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
      await refresh(); setNotice(`Reserva #${row.id} creada para ${row.unit}.`); setRequester('');
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  async function cancel() {
    if (!cancelTarget) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await request(`/reservations/${cancelTarget.id}/cancel`, { method: 'POST' });
      await refresh(); setAvailability(null); setNotice(`Reserva #${cancelTarget.id} cancelada. El horario quedó libre.`); setCancelTarget(null);
    } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  }
  return <>
    <header className="topbar"><a className="brand" href="#"><span className="brand-mark">L<span>·</span></span><span>LAB<span className="brand-sub">Gestión de equipos</span></span></a><span className="local-badge"><i/> Entorno local</span></header>
    <main>
      <div className="page-heading"><div><p className="eyebrow">LABORATORIO / RESERVAS</p><h1>Un equipo. Un horario.<br/><span>Todo en orden.</span></h1><p className="intro">Consultá disponibilidad y organizá las reservas del laboratorio.</p></div><div className="date-note"><span>HORA DEL LABORATORIO</span><strong>Argentina · UTC−03:00</strong><small>Horarios compartidos para todas las unidades</small></div></div>
      <section className="metrics" aria-label="Resumen"><div><span>Unidades del laboratorio</span><strong>05 <small>inventario fijo</small></strong></div><div><span>Disponibles ahora</span><strong>{loading ? '—' : String(5 - occupied.size).padStart(2, '0')} <small>de 5 unidades</small></strong></div><div><span>Reservas activas</span><strong>{loading ? '—' : String(active.length).padStart(2, '0')} <small>en el historial</small></strong></div><div><span>Reservas canceladas</span><strong>{loading ? '—' : String(reservations.length - active.length).padStart(2, '0')} <small>registro conservado</small></strong></div></section>
      <div className="workspace"><section className="equipment"><div className="section-title"><div><p className="eyebrow">01 / INVENTARIO</p><h2>Elegí tu equipo</h2></div><span className="count">5 unidades</span></div><div className="equipment-list">{inventory.map(item => <button key={item.id} type="button" className={'equipment-card ' + (unit === item.id ? 'selected' : '')} onClick={() => { setUnit(item.id); invalidate(); }} aria-pressed={unit === item.id}><span className="equipment-icon">{item.symbol}</span><span className="equipment-info"><small>{item.category} <b>·</b> {item.id}</small><strong>{item.name}</strong></span><span className="equipment-state">{loading ? 'Cargando…' : occupied.has(item.id) ? 'En uso' : 'Libre ahora'}<span className="radio-dot"/></span></button>)}</div><p className="helper">El estado actual es orientativo. Consultá el intervalo que necesitás antes de reservar.</p></section>
      <section className="booking" aria-labelledby="booking-title"><p className="eyebrow">02 / PLANIFICACIÓN</p><h2 id="booking-title">Prepará tu reserva</h2><p className="booking-sub">Unidad seleccionada <strong>{unit}</strong></p><form onSubmit={reserve}>
        <label>Fecha<input required type="date" min={argentinaLocal(clock).slice(0, 10)} max="9999-12-31" value={start.slice(0, 10)} onChange={e => { setStart(e.target.value + 'T' + start.slice(11)); setEnd(e.target.value + 'T' + end.slice(11)); invalidate(); }} /></label>
        <label>Inicio<select required value={start.slice(11)} onChange={e => { setStart(start.slice(0, 10) + 'T' + e.target.value); invalidate(); }}>{timeSlots.slice(0, -1).map(time => <option key={time} value={time} disabled={Date.parse(start.slice(0, 10) + 'T' + time + ':00-03:00') < clock}>{time}</option>)}</select></label>
        <label>Fin<select required value={end.slice(11)} onChange={e => { setEnd(start.slice(0, 10) + 'T' + e.target.value); invalidate(); }}>{timeSlots.slice(1).map(time => <option key={time} value={time} disabled={time <= start.slice(11)}>{time}</option>)}</select></label>
        <p className="form-footnote">De 06:00 a 20:00, en intervalos de 15 minutos. Solo fechas y horarios que no hayan pasado, en hora de Argentina.</p>
        <button disabled={busy || loading} className="button secondary full" type="button" onClick={check}>Consultar disponibilidad <span>↗</span></button>
        {availability && <div className={'availability ' + (availability.available ? 'free' : 'taken')} role="status"><strong>{availability.available ? '✓ El horario está disponible' : 'El horario está ocupado'}</strong><span>{availability.available ? 'Podés crear la reserva para este intervalo.' : `Conflicto con ${availability.conflicts.map(r => '#' + r.id).join(', ')}. Elegí otro horario o unidad.`}</span></div>}
        <div className="form-divider"/><label>Solicitante ficticio<input required maxLength={120} placeholder="Ej.: Investigador A" value={requester} onChange={e => setRequester(e.target.value)} /></label>
        <button disabled={busy || loading} className="button primary full" type="submit">{busy ? 'Procesando…' : 'Crear reserva'} <span>→</span></button><p className="form-footnote">Una unidad por reserva. La disponibilidad se valida nuevamente al confirmar.</p>
      </form></section></div>
      {error && <div className="message error" role="alert">{error}<button aria-label="Cerrar error" onClick={() => setError('')}>×</button></div>}
      {notice && <div className="message success" role="status">{notice}<button aria-label="Cerrar aviso" onClick={() => setNotice('')}>×</button></div>}
      <section className="history"><div className="section-title history-heading"><div><p className="eyebrow">03 / HISTORIAL</p><h2>Cada reserva, registrada</h2></div><button type="button" className="refresh" disabled={busy || loading} onClick={() => { setLoading(true); refresh().catch(e => setError(e.message)).finally(() => setLoading(false)); }}>↻ Actualizar</button></div>
      <div className="history-tools"><div className="tabs" aria-label="Filtrar por estado">{[['TODAS', 'Todas'], ['ACTIVA', 'Activas'], ['CANCELADA', 'Canceladas']].map(([value, label]) => <button type="button" key={value} className={filter === value ? 'current' : ''} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}</div><label className="search"><span className="sr-only">Buscar por solicitante, unidad o ID</span><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar solicitante, unidad o ID…" type="search" /></label></div>
      {loading ? <div className="empty" role="status">Cargando el historial…</div> : visible.length === 0 ? <div className="empty"><span>▤</span><h3>{reservations.length ? 'No hay coincidencias' : 'El próximo turno empieza acá'}</h3><p>{reservations.length ? 'Probá con otro filtro o búsqueda.' : 'Creá tu primera reserva. Las cancelaciones también se conservarán en este historial.'}</p></div> : <div className="table-scroll"><table><thead><tr><th>Reserva / unidad</th><th>Solicitante</th><th>Intervalo · Argentina</th><th>Estado</th><th><span className="sr-only">Acciones</span></th></tr></thead><tbody>{visible.map(row => <tr key={row.id}><td><strong>{row.unit}</strong><small>Reserva #{row.id}</small></td><td>{row.requester}</td><td><span>{dateFormat.format(row.start)} · {timeFormat.format(row.start)}</span><small>hasta {dateFormat.format(row.end)} · {timeFormat.format(row.end)}</small></td><td><span className={'status ' + row.status.toLowerCase()}>{row.status === 'ACTIVA' ? 'Activa' : 'Cancelada'}</span></td><td>{row.status === 'ACTIVA' && <button disabled={busy} className="cancel-button" aria-label={`Cancelar reserva ${row.id}`} onClick={() => setCancelTarget(row)}>Cancelar</button>}</td></tr>)}</tbody></table></div>}
      <p className="history-note">Las reservas canceladas liberan el horario y conservan sus datos.</p></section>
      <footer><span><strong>LAB</strong> / Reservas de equipos</span><span>Datos guardados localmente · Sin cuentas ni servicios externos</span></footer>
    </main>
    {cancelTarget && <div className="modal-backdrop"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="cancel-title" onKeyDown={e => { if (e.key === 'Escape' && !busy) setCancelTarget(null); }}><p className="eyebrow">CANCELAR RESERVA</p><h2 id="cancel-title">¿Liberar este horario?</h2><p>La reserva #{cancelTarget.id} de {cancelTarget.unit} quedará cancelada. Se conservarán el solicitante, las fechas y su identificador.</p><div><button autoFocus disabled={busy} className="button secondary" onClick={() => setCancelTarget(null)}>Volver</button><button disabled={busy} className="button primary" onClick={cancel}>{busy ? 'Cancelando…' : 'Confirmar cancelación'}</button></div>{error && <p role="alert">{error}</p>}</section></div>}
  </>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
