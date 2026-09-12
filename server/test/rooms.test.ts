import assert from 'node:assert/strict';
import { after, before, beforeEach, describe, it } from 'node:test';
import { startTestApi, type TestApi } from './support/testServer.ts';

let api: TestApi;

before(async () => {
  api = await startTestApi();
});

after(async () => {
  await api.close();
});

beforeEach(() => {
  api.reset();
});

describe('GET /api/rooms', () => {
  it('returns the seeded rooms', async () => {
    const response = await api.get('/api/rooms');

    assert.equal(response.status, 200);
    assert.equal(response.body.length, 4);

    const room = response.body[0];
    assert.ok(typeof room.name === 'string');
    assert.ok(typeof room.floor === 'number');
    assert.ok(typeof room.capacity === 'number');
  });
});

describe('GET /api/rooms/:id/bookings', () => {
  it('returns only the bookings for that room', async () => {
    const rooms = await api.get('/api/rooms');
    const roomId = rooms.body[0].id;

    const response = await api.get(`/api/rooms/${roomId}/bookings`);

    assert.equal(response.status, 200);
    for (const booking of response.body) {
      assert.equal(booking.roomId, roomId);
    }
  });

  it('returns 404 for a room that does not exist', async () => {
    const response = await api.get('/api/rooms/999/bookings');

    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, 'NOT_FOUND');
  });
});
