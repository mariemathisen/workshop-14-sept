import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from '../../src/app.ts';
import { closeDatabase, connectDatabase } from '../../src/db/database.ts';
import { initializeDatabase } from '../../src/db/initialize.ts';

export type TestResponse = {
  status: number;
  body: any;
};

export type TestApi = {
  get(path: string): Promise<TestResponse>;
  post(path: string, body: unknown): Promise<TestResponse>;
  reset(): void;
  close(): Promise<void>;
};

export async function startTestApi(): Promise<TestApi> {
  const server: Server = createApp().listen(0);
  await once(server, 'listening');
  const { port } = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${port}`;

  const readResponse = async (response: Response): Promise<TestResponse> => ({
    status: response.status,
    body: await response.json(),
  });

  return {
    async get(path) {
      return readResponse(await fetch(baseUrl + path));
    },
    async post(path, body) {
      return readResponse(
        await fetch(baseUrl + path, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        }),
      );
    },
    reset() {
      closeDatabase();
      initializeDatabase(connectDatabase(':memory:'));
    },
    async close() {
      closeDatabase();
      server.close();
      await once(server, 'close');
    },
  };
}
