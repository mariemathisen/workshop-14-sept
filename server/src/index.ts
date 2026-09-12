import { createApp } from './app.ts';
import { config } from './config.ts';
import { connectDatabase } from './db/database.ts';
import { initializeDatabase } from './db/initialize.ts';

const db = connectDatabase(config.databasePath);
initializeDatabase(db);

createApp().listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
