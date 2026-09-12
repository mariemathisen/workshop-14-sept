import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

let connection: DatabaseSync | null = null;

export function connectDatabase(filePath: string): DatabaseSync {
  if (filePath !== ':memory:') {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  connection = new DatabaseSync(filePath);
  connection.exec('PRAGMA foreign_keys = ON');
  return connection;
}

export function getDatabase(): DatabaseSync {
  if (!connection) {
    throw new Error('Database is not connected. Call connectDatabase() first.');
  }
  return connection;
}

export function closeDatabase(): void {
  connection?.close();
  connection = null;
}
