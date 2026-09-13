import type { Express } from 'express';
import express from 'express';
import { errorHandler } from './middleware/errorHandler.ts';
import { bookingRoutes } from './routes/bookingRoutes.ts';
import { roomRoutes } from './routes/roomRoutes.ts';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use('/api/rooms', roomRoutes);
  app.use('/api/bookings', bookingRoutes);

  app.use((_req, res) => {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Unknown endpoint' },
    });
  });

  app.use(errorHandler);

  return app;
}
