import path from 'node:path';

const serverRoot = path.resolve(import.meta.dirname, '..');

export const config = {
  port: Number(process.env.PORT ?? 3001),
  databasePath: path.join(serverRoot, 'data', 'bookings.db'),
  schemaPath: path.join(serverRoot, 'src', 'db', 'schema.sql'),
};
