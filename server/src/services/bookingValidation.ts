import { ValidationError } from '../errors.ts';
import type { NewBooking, Room } from '../types.ts';
import { getRoom } from './roomService.ts';

const MAX_DURATION_HOURS = 8;

export const MAX_SERIES_WEEKS = 26;
export const WEEK_IN_MS = 7 * 24 * 3_600_000;

export type ValidatedBooking = {
  room: Room;
  booking: NewBooking;
};

/**
 * Reglene som gjelder én booking, uansett om den står alene eller er én
 * forekomst i en serie. Tidspunktene normaliseres til ISO 8601 i UTC.
 * Overlapp sjekkes ikke her -- det krever databasen, og en serie må sjekke alle
 * forekomstene sine før noen av dem skrives.
 */
export function validateBooking(input: NewBooking): ValidatedBooking {
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

  return {
    room,
    booking: {
      roomId: room.id,
      title,
      bookedBy,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
    },
  };
}

export function parseTimestamp(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} must be a valid ISO 8601 timestamp`);
  }
  return date;
}
