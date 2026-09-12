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

function bookingPayload(overrides: Record<string, unknown> = {}) {
  return {
    roomId: 1,
    title: 'Sprint planning',
    bookedBy: 'ada.lovelace',
    startsAt: '2030-03-04T09:00:00.000Z',
    endsAt: '2030-03-04T10:00:00.000Z',
    ...overrides,
  };
}

describe('POST /api/bookings', () => {
  it('creates a booking', async () => {
    const response = await api.post('/api/bookings', bookingPayload());

    assert.equal(response.status, 201);
    assert.equal(response.body.roomId, 1);
    assert.equal(response.body.title, 'Sprint planning');
    assert.equal(response.body.startsAt, '2030-03-04T09:00:00.000Z');
    assert.ok(response.body.id > 0);

    const bookings = await api.get('/api/rooms/1/bookings');
    assert.ok(bookings.body.some((booking: { id: number }) => booking.id === response.body.id));
  });

  it('rejects a booking that overlaps an existing one in the same room', async () => {
    await api.post('/api/bookings', bookingPayload());

    const response = await api.post(
      '/api/bookings',
      bookingPayload({
        title: 'Retrospective',
        startsAt: '2030-03-04T09:30:00.000Z',
        endsAt: '2030-03-04T10:30:00.000Z',
      }),
    );

    assert.equal(response.status, 409);
    assert.equal(response.body.error.code, 'BOOKING_CONFLICT');
    assert.match(response.body.error.message, /overlaps/);
  });

  it('allows a booking that starts when another one ends', async () => {
    await api.post('/api/bookings', bookingPayload());

    const response = await api.post(
      '/api/bookings',
      bookingPayload({
        startsAt: '2030-03-04T10:00:00.000Z',
        endsAt: '2030-03-04T11:00:00.000Z',
      }),
    );

    assert.equal(response.status, 201);
  });

  it('allows the same time in a different room', async () => {
    await api.post('/api/bookings', bookingPayload());

    const response = await api.post('/api/bookings', bookingPayload({ roomId: 2 }));

    assert.equal(response.status, 201);
  });

  it('rejects a booking that ends before it starts', async () => {
    const response = await api.post(
      '/api/bookings',
      bookingPayload({
        startsAt: '2030-03-04T11:00:00.000Z',
        endsAt: '2030-03-04T10:00:00.000Z',
      }),
    );

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  });

  it('rejects a booking longer than eight hours', async () => {
    const response = await api.post(
      '/api/bookings',
      bookingPayload({
        startsAt: '2030-03-04T08:00:00.000Z',
        endsAt: '2030-03-04T17:00:00.000Z',
      }),
    );

    assert.equal(response.status, 400);
  });

  it('rejects a booking without a title', async () => {
    const response = await api.post('/api/bookings', bookingPayload({ title: '   ' }));

    assert.equal(response.status, 400);
  });

  it('rejects a booking for a room that does not exist', async () => {
    const response = await api.post('/api/bookings', bookingPayload({ roomId: 999 }));

    assert.equal(response.status, 404);
    assert.equal(response.body.error.code, 'NOT_FOUND');
  });
});

describe('GET /api/bookings', () => {
  it('returns the seeded bookings sorted by start time', async () => {
    const response = await api.get('/api/bookings');

    assert.equal(response.status, 200);
    assert.ok(response.body.length > 0);

    const startTimes = response.body.map((booking: { startsAt: string }) => booking.startsAt);
    assert.deepEqual(startTimes, [...startTimes].sort());
  });
});
