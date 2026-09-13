import { BookingConflictError, ValidationError } from '../errors.ts';
import * as bookingRepository from '../repositories/bookingRepository.ts';
import type { Booking, NewBooking, NewBookingSeries } from '../types.ts';
import {
  MAX_SERIES_WEEKS,
  parseTimestamp,
  validateBooking,
  WEEK_IN_MS,
} from './bookingValidation.ts';
import { getRoom } from './roomService.ts';

/**
 * Datoen slik den ser ut i Norge. Tidssonen oppgis eksplisitt, ellers ville
 * meldingen fulgt serverens tidssone og navngitt feil dag for kveldsmøter.
 */
const norwegianDate = new Intl.DateTimeFormat('nb-NO', {
  timeZone: 'Europe/Oslo',
  dateStyle: 'short',
});

export function listBookings(): Booking[] {
  return bookingRepository.findAll();
}

export function listBookingsForRoom(roomId: number): Booking[] {
  getRoom(roomId);
  return bookingRepository.findByRoom(roomId);
}

export function createBooking(input: NewBooking): Booking {
  const { room, booking } = validateBooking(input);

  assertNoOverlap(booking, `${room.name} already has a booking that overlaps the selected time`);

  return bookingRepository.insert(booking);
}

export function createBookingSeries(input: NewBookingSeries): Booking[] {
  const { room, booking } = validateSeries(input);
  const occurrences = generateOccurrences(booking, new Date(input.repeatUntil));

  for (const occurrence of occurrences) {
    assertNoOverlap(
      occurrence,
      `${room.name} already has a booking that overlaps ${norwegianDate.format(new Date(occurrence.startsAt))}`,
    );
  }

  return bookingRepository.insertMany(occurrences);
}

/**
 * Reglene for selve serien kjører før reglene for den enkelte bookingen, slik
 * at en ugyldig sluttdato meldes tilbake før tittel og klokkeslett vurderes.
 */
function validateSeries(input: NewBookingSeries): ReturnType<typeof validateBooking> {
  const repeatUntil = parseTimestamp(input.repeatUntil, 'repeatUntil');
  const startsAt = parseTimestamp(input.startsAt, 'startsAt');

  if (repeatUntil < startsAt) {
    throw new ValidationError('repeatUntil must not be before startsAt');
  }

  const weeks = Math.floor((repeatUntil.getTime() - startsAt.getTime()) / WEEK_IN_MS);
  if (weeks > MAX_SERIES_WEEKS) {
    throw new ValidationError(`A series can span at most ${MAX_SERIES_WEEKS} weeks`);
  }

  return validateBooking(input);
}

/**
 * Bygger forekomstene i serien ut fra den første bookingen. Alle forekomstene
 * arver rom, tittel, navn og varighet fra den første -- det eneste som flytter
 * seg er tidspunktet.
 *
 * `first` er ferdig validert og normalisert: `startsAt` og `endsAt` er ISO 8601
 * i UTC. `repeatUntil` er aldri før `first.startsAt`, så lista har minst ett
 * element. Serien går til og med den siste forekomsten som starter senest på
 * `repeatUntil`.
 */
function generateOccurrences(first: NewBooking, repeatUntil: Date): NewBooking[] {
  const occurrences: NewBooking[] = [];
  const firstStart = new Date(first.startsAt).getTime();
  const duration = new Date(first.endsAt).getTime() - firstStart;

  for (let start = firstStart; start <= repeatUntil.getTime(); start += WEEK_IN_MS) {
    occurrences.push({
      ...first,
      startsAt: new Date(start).toISOString(),
      endsAt: new Date(start + duration).toISOString(),
    });
  }

  return occurrences;
}

function assertNoOverlap(booking: NewBooking, message: string): void {
  const overlapping = bookingRepository.findOverlapping(
    booking.roomId,
    booking.startsAt,
    booking.endsAt,
  );

  if (overlapping.length > 0) {
    throw new BookingConflictError(message);
  }
}
