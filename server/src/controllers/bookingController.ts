import type { Request, Response } from 'express';
import { ValidationError } from '../errors.ts';
import * as bookingService from '../services/bookingService.ts';
import type { NewBooking } from '../types.ts';
import { parseNumericParam } from './params.ts';

export function list(_req: Request, res: Response): void {
  res.json(bookingService.listBookings());
}

export function listForRoom(req: Request, res: Response): void {
  const roomId = parseNumericParam(req.params.id, 'id');
  res.json(bookingService.listBookingsForRoom(roomId));
}

export function create(req: Request, res: Response): void {
  const booking = bookingService.createBooking(parseNewBooking(req.body));
  res.status(201).json(booking);
}

function parseNewBooking(body: unknown): NewBooking {
  if (typeof body !== 'object' || body === null) {
    throw new ValidationError('Request body must be a JSON object');
  }

  const candidate = body as Record<string, unknown>;

  return {
    roomId: requireNumber(candidate.roomId, 'roomId'),
    title: requireString(candidate.title, 'title'),
    bookedBy: requireString(candidate.bookedBy, 'bookedBy'),
    startsAt: requireString(candidate.startsAt, 'startsAt'),
    endsAt: requireString(candidate.endsAt, 'endsAt'),
  };
}

function requireString(value: unknown, field: string): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} is required and must be a string`);
  }
  return value;
}

function requireNumber(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new ValidationError(`${field} is required and must be an integer`);
  }
  return value;
}
