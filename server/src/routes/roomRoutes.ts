import { Router } from 'express';
import * as bookingController from '../controllers/bookingController.ts';
import * as roomController from '../controllers/roomController.ts';

export const roomRoutes = Router();

roomRoutes.get('/', roomController.list);
roomRoutes.get('/:id', roomController.show);
roomRoutes.get('/:id/bookings', bookingController.listForRoom);
