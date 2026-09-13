import type { FormEvent } from 'react';
import { useState } from 'react';
import * as api from '../api.ts';
import type { Room } from '../types.ts';

type Props = {
  rooms: Room[];
  onCreated: () => Promise<void>;
};

const MAX_SERIES_WEEKS = 26;

const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'long' });

/** Dagens dato pluss et antall dager, som "2026-09-22". */
function isoDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

/**
 * Datoene regnes om på kalenderen og ikke på klokka. Lokal tid har døgn på 23
 * og 25 timer to ganger i året, og en differanse i millisekunder ville bommet
 * med én forekomst i akkurat de ukene.
 */
function dayNumber(value: string): number {
  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day) / 86_400_000;
}

function shiftDays(value: string, days: number): string {
  return new Date((dayNumber(value) + days) * 86_400_000).toISOString().slice(0, 10);
}

/** Leser "2026-09-22" og "09:00" som lokal tid, slik datetime-local gjorde. */
function toLocalDate(date: string, time: string): Date {
  return new Date(`${date}T${time}`);
}

/**
 * Siste øyeblikk av den lokale dagen. Serien skal gå til og med datoen
 * brukeren valgte, og et klokkeslett ville forskjøvet seg en time i forhold
 * til forekomstene hvis sommertiden slår inn underveis.
 */
function endOfLocalDay(date: string): Date {
  return new Date(toLocalDate(shiftDays(date, 1), '00:00').getTime() - 1);
}

export function BookingForm({ rooms, onCreated }: Props) {
  const [roomId, setRoomId] = useState(String(rooms[0]?.id ?? ''));
  const [title, setTitle] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [date, setDate] = useState(isoDate(1));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [recurring, setRecurring] = useState(false);
  const [repeatUntil, setRepeatUntil] = useState(isoDate(1));
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const spanInDays = dayNumber(repeatUntil) - dayNumber(date);
  const occurrences = Math.floor(spanInDays / 7) + 1;

  let seriesError: string | null = null;
  if (recurring && spanInDays < 0) {
    seriesError = 'Repeat until must not be before the date.';
  } else if (recurring && spanInDays > MAX_SERIES_WEEKS * 7) {
    seriesError = `A series can span at most ${MAX_SERIES_WEEKS} weeks.`;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (seriesError) {
      return;
    }

    setError(null);
    setConfirmation(null);
    setSaving(true);

    const booking = {
      roomId: Number(roomId),
      title,
      bookedBy,
      startsAt: toLocalDate(date, startTime).toISOString(),
      endsAt: toLocalDate(date, endTime).toISOString(),
    };
    const roomName = rooms.find((room) => room.id === booking.roomId)?.name;

    try {
      if (recurring) {
        const series = await api.createBookingSeries({
          ...booking,
          repeatUntil: endOfLocalDay(repeatUntil).toISOString(),
        });
        setConfirmation(`Booked ${roomName} ${series.length} times.`);
      } else {
        await api.createBooking(booking);
        setConfirmation(`Booked ${roomName}.`);
      }
      setTitle('');
      await onCreated();
    } catch (caught) {
      setError(caught instanceof api.ApiError ? caught.message : 'Could not reach the API');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="booking-form">
      <h2>Book a room</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Room
          <select value={roomId} onChange={(event) => setRoomId(event.target.value)}>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Meeting
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="What is it about?"
            required
          />
        </label>

        <label>
          Your name
          <input
            value={bookedBy}
            onChange={(event) => setBookedBy(event.target.value)}
            placeholder="firstname.lastname"
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <div className="field-row">
          <label>
            From
            <input
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              required
            />
          </label>

          <label>
            To
            <input
              type="time"
              value={endTime}
              onChange={(event) => setEndTime(event.target.value)}
              required
            />
          </label>
        </div>

        <label className="field-inline">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(event) => setRecurring(event.target.checked)}
          />
          Repeat weekly
        </label>

        {recurring && (
          <label>
            Repeat until
            <input
              type="date"
              value={repeatUntil}
              min={date}
              max={shiftDays(date, MAX_SERIES_WEEKS * 7)}
              onChange={(event) => setRepeatUntil(event.target.value)}
              required
            />
          </label>
        )}

        {recurring && !seriesError && (
          <p className="form-message form-hint">
            Every {weekdayFormat.format(toLocalDate(date, startTime))}, {occurrences}{' '}
            {occurrences === 1 ? 'booking' : 'bookings'}.
          </p>
        )}

        <button type="submit" disabled={saving || seriesError !== null}>
          {saving ? 'Booking…' : 'Book room'}
        </button>

        {seriesError && <p className="form-message form-error">{seriesError}</p>}
        {error && <p className="form-message form-error">{error}</p>}
        {confirmation && <p className="form-message form-confirmation">{confirmation}</p>}
      </form>
    </section>
  );
}
