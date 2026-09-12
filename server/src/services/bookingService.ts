import { BookingConflictError, ValidationError } from '../errors.ts';
import * as bookingRepository from '../repositories/bookingRepository.ts';
import type { Booking, NewBooking } from '../types.ts';
import { getRoom } from './roomService.ts';

const MAX_DURATION_HOURS = 8;

export function listBookings(): Booking[] {
  return bookingRepository.findAll();
}

export function listBookingsForRoom(roomId: number): Booking[] {
  getRoom(roomId);
  return bookingRepository.findByRoom(roomId);
}

export function createBooking(input: NewBooking): Booking {
  const title = input.title.trim();
  const bookedBy = input.bookedBy.trim();

  if (title.length === 0) {
    throw new ValidationError('title must not be empty');
  }
  if (bookedBy.length === 0) {
    throw new ValidationError('bookedBy must not be empty');
  }

  const startsAt = parseTimestamp(input.startsAt, 'startsAt');
  const endsAt = parseTimestamp(input.endsAt, 'endsAt');

  if (endsAt <= startsAt) {
    throw new ValidationError('endsAt must be after startsAt');
  }

  const durationHours = (endsAt.getTime() - startsAt.getTime()) / 3_600_000;
  if (durationHours > MAX_DURATION_HOURS) {
    throw new ValidationError(`A booking can last at most ${MAX_DURATION_HOURS} hours`);
  }

  const room = getRoom(input.roomId);

  const booking: NewBooking = {
    roomId: room.id,
    title,
    bookedBy,
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  };

  const overlapping = bookingRepository.findOverlapping(
    booking.roomId,
    booking.startsAt,
    booking.endsAt,
  );

  if (overlapping.length > 0) {
    throw new BookingConflictError(
      `${room.name} already has a booking that overlaps the selected time`,
    );
  }

  return bookingRepository.insert(booking);
}

function parseTimestamp(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} must be a valid ISO 8601 timestamp`);
  }
  return date;
}
