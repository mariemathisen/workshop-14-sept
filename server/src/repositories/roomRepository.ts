import { getDatabase } from '../db/database.ts';
import type { Room } from '../types.ts';

type RoomRow = {
  id: number;
  name: string;
  floor: number;
  capacity: number;
};

function toRoom(row: RoomRow): Room {
  return {
    id: row.id,
    name: row.name,
    floor: row.floor,
    capacity: row.capacity,
  };
}

export function findAll(): Room[] {
  const rows = getDatabase()
    .prepare('SELECT id, name, floor, capacity FROM rooms ORDER BY floor, name')
    .all() as RoomRow[];

  return rows.map(toRoom);
}

export function findById(id: number): Room | null {
  const row = getDatabase()
    .prepare('SELECT id, name, floor, capacity FROM rooms WHERE id = ?')
    .get(id);

  return row ? toRoom(row as RoomRow) : null;
}
