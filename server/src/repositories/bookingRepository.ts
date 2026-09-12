import { getDatabase } from '../db/database.ts';
import type { Booking, NewBooking } from '../types.ts';

type BookingRow = {
  id: number;
  room_id: number;
  title: string;
  booked_by: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
};

const columns = 'id, room_id, title, booked_by, starts_at, ends_at, created_at';

function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    roomId: row.room_id,
    title: row.title,
    bookedBy: row.booked_by,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    createdAt: row.created_at,
  };
}

export function findAll(): Booking[] {
  const rows = getDatabase()
    .prepare(`SELECT ${columns} FROM bookings ORDER BY starts_at`)
    .all() as BookingRow[];

  return rows.map(toBooking);
}

export function findById(id: number): Booking | null {
  const row = getDatabase()
    .prepare(`SELECT ${columns} FROM bookings WHERE id = ?`)
    .get(id) as BookingRow | undefined;

  return row ? toBooking(row) : null;
}

export function findByRoom(roomId: number): Booking[] {
  const rows = getDatabase()
    .prepare(`SELECT ${columns} FROM bookings WHERE room_id = ? ORDER BY starts_at`)
    .all(roomId) as BookingRow[];

  return rows.map(toBooking);
}

export function findOverlapping(roomId: number, startsAt: string, endsAt: string): Booking[] {
  const rows = getDatabase()
    .prepare(
      `SELECT ${columns} FROM bookings
       WHERE room_id = ? AND starts_at < ? AND ends_at > ?
       ORDER BY starts_at`,
    )
    .all(roomId, endsAt, startsAt) as BookingRow[];

  return rows.map(toBooking);
}

export function insert(booking: NewBooking): Booking {
  const result = getDatabase()
    .prepare(
      `INSERT INTO bookings (room_id, title, booked_by, starts_at, ends_at)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(booking.roomId, booking.title, booking.bookedBy, booking.startsAt, booking.endsAt);

  return findById(Number(result.lastInsertRowid))!;
}
