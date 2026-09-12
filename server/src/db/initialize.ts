import fs from 'node:fs';
import type { DatabaseSync } from 'node:sqlite';
import { config } from '../config.ts';
import { seedDatabase } from './seed.ts';

export function initializeDatabase(db: DatabaseSync): void {
  const schema = fs.readFileSync(config.schemaPath, 'utf8');
  db.exec(schema);

  const { count } = db.prepare('SELECT COUNT(*) AS count FROM rooms').get() as { count: number };
  if (count === 0) {
    seedDatabase(db);
  }
}
