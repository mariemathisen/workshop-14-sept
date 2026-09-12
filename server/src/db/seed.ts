import type { DatabaseSync } from 'node:sqlite';

const rooms = [
  { name: 'Fjorden', floor: 1, capacity: 12 },
  { name: 'Skogen', floor: 1, capacity: 6 },
  { name: 'Kaia', floor: 2, capacity: 4 },
  { name: 'Loftet', floor: 3, capacity: 20 },
];

const bookings = [
  { room: 'Fjorden', title: 'Designgjennomgang', bookedBy: 'ingrid.ruud', dayOffset: 0, startHour: 9, endHour: 10 },
  { room: 'Fjorden', title: 'Kundemøte', bookedBy: 'jonas.berg', dayOffset: 0, startHour: 13, endHour: 15 },
  { room: 'Kaia', title: 'Intervju', bookedBy: 'sara.lind', dayOffset: 0, startHour: 11, endHour: 12 },
  { room: 'Loftet', title: 'Teknisk avklaring', bookedBy: 'ingrid.ruud', dayOffset: 1, startHour: 10, endHour: 11 },
];

function atHour(dayOffset: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export function seedDatabase(db: DatabaseSync): void {
  const insertRoom = db.prepare('INSERT INTO rooms (name, floor, capacity) VALUES (?, ?, ?)');
  const roomIds = new Map<string, number>();

  for (const room of rooms) {
    const result = insertRoom.run(room.name, room.floor, room.capacity);
    roomIds.set(room.name, Number(result.lastInsertRowid));
  }

  const insertBooking = db.prepare(
    'INSERT INTO bookings (room_id, title, booked_by, starts_at, ends_at) VALUES (?, ?, ?, ?, ?)',
  );

  for (const booking of bookings) {
    insertBooking.run(
      roomIds.get(booking.room)!,
      booking.title,
      booking.bookedBy,
      atHour(booking.dayOffset, booking.startHour),
      atHour(booking.dayOffset, booking.endHour),
    );
  }
}
