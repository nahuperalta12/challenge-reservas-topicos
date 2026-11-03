import express, { type ErrorRequestHandler } from 'express';
import { resolve } from 'node:path';
import { inventory } from '../shared/types.js';
import { AppError } from './domain.js';
import type { Store } from './store.js';
export function createApp(store: Store) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '16kb' }));
  app.get('/api/inventory', (_req, res) => res.json(inventory));
  app.get('/api/reservations', (_req, res) => res.json(store.list()));
  app.get('/api/availability', (req, res) => res.json(store.availability(req.query.unit, req.query.start, req.query.end)));
  app.post('/api/reservations', (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new AppError('Enviá los datos de la reserva.');
    res.status(201).json(store.create(req.body));
  });
  app.post('/api/reservations/:id/cancel', (req, res) => res.json(store.cancel(req.params.id)));
  app.use('/api', (_req, res) => res.status(404).json({ error: 'La operación no existe.' }));
  app.use(express.static(resolve('dist')));
  const handleError: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) { res.status(error.status).json({ error: error.message }); return; }
    if (error instanceof SyntaxError) { res.status(400).json({ error: 'El JSON enviado no es válido.' }); return; }
    if (error.status === 413) { res.status(413).json({ error: 'La solicitud es demasiado grande.' }); return; }
    console.error(error);
    res.status(500).json({ error: 'No se pudo completar la operación.' });
  };
  app.use(handleError);
  return app;
}
