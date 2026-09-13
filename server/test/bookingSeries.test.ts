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

/** 5. mars 2030 er en tirsdag. */
function seriesPayload(overrides: Record<string, unknown> = {}) {
  return {
    roomId: 1,
    title: 'Ukentlig sync',
    bookedBy: 'ada.lovelace',
    startsAt: '2030-03-05T09:00:00.000Z',
    endsAt: '2030-03-05T10:00:00.000Z',
    repeatUntil: '2030-03-26T23:59:59.999Z',
    ...overrides,
  };
}

describe('POST /api/bookings/series', () => {
  it('creates one booking per week on the same weekday', async () => {
    const response = await api.post('/api/bookings/series', seriesPayload());

    assert.equal(response.status, 201);
    assert.equal(response.body.length, 4);

    const starts = response.body.map((booking: { startsAt: string }) => booking.startsAt);
    assert.deepEqual(starts, [
      '2030-03-05T09:00:00.000Z',
      '2030-03-12T09:00:00.000Z',
      '2030-03-19T09:00:00.000Z',
      '2030-03-26T09:00:00.000Z',
    ]);

    for (const booking of response.body) {
      assert.equal(new Date(booking.startsAt).getUTCDay(), 2);
      assert.equal(booking.roomId, 1);
      assert.equal(booking.title, 'Ukentlig sync');
    }
  });

  it('carries the duration of the first occurrence to every other one', async () => {
    const response = await api.post(
      '/api/bookings/series',
      seriesPayload({ endsAt: '2030-03-05T10:30:00.000Z' }),
    );

    assert.equal(response.status, 201);
    for (const booking of response.body) {
      const minutes = (Date.parse(booking.endsAt) - Date.parse(booking.startsAt)) / 60_000;
      assert.equal(minutes, 90);
    }
  });

  it('creates nothing when one occurrence collides, and names the date', async () => {
    const before = await api.get('/api/bookings');

    const blocking = await api.post('/api/bookings', {
      roomId: 1,
      title: 'Allerede booket',
      bookedBy: 'grace.hopper',
      startsAt: '2030-03-19T09:30:00.000Z',
      endsAt: '2030-03-19T10:30:00.000Z',
    });
    assert.equal(blocking.status, 201);

    const response = await api.post('/api/bookings/series', seriesPayload());

    assert.equal(response.status, 409);
    assert.equal(response.body.error.code, 'BOOKING_CONFLICT');
    assert.match(response.body.error.message, /19\.03\.2030/);

    const after = await api.get('/api/bookings');
    assert.equal(after.body.length, before.body.length + 1);
  });

  it('creates a single booking when the series ends the day it starts', async () => {
    const response = await api.post(
      '/api/bookings/series',
      seriesPayload({ repeatUntil: '2030-03-05T23:59:59.999Z' }),
    );

    assert.equal(response.status, 201);
    assert.equal(response.body.length, 1);
    assert.equal(response.body[0].startsAt, '2030-03-05T09:00:00.000Z');
  });

  it('rejects a series that ends before it starts', async () => {
    const response = await api.post(
      '/api/bookings/series',
      seriesPayload({ repeatUntil: '2030-03-04T09:00:00.000Z' }),
    );

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
    assert.match(response.body.error.message, /repeatUntil/);
  });

  it('rejects a series longer than 26 weeks', async () => {
    const response = await api.post(
      '/api/bookings/series',
      seriesPayload({ repeatUntil: '2030-09-17T09:00:00.000Z' }),
    );

    assert.equal(response.status, 400);
    assert.match(response.body.error.message, /26 weeks/);
  });

  it('rejects a repeatUntil that is not a timestamp', async () => {
    const response = await api.post(
      '/api/bookings/series',
      seriesPayload({ repeatUntil: '2030-03-26' }),
    );

    assert.equal(response.status, 400);
    assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  });

  it('applies the single-booking rules to a series as well', async () => {
    const response = await api.post(
      '/api/bookings/series',
      seriesPayload({ endsAt: '2030-03-05T20:00:00.000Z' }),
    );

    assert.equal(response.status, 400);
    assert.match(response.body.error.message, /at most 8 hours/);
  });
});
