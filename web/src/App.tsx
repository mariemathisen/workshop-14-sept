import { useCallback, useEffect, useState } from 'react';
import * as api from './api.ts';
import { BookingForm } from './components/BookingForm.tsx';
import { RoomList } from './components/RoomList.tsx';
import type { Booking, Room } from './types.ts';

export function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  const load = useCallback(async () => {
    try {
      const [loadedRooms, loadedBookings] = await Promise.all([
        api.listRooms(),
        api.listBookings(),
      ]);
      setRooms(loadedRooms);
      setBookings(loadedBookings);
      setStatus('ready');
    } catch {
      setStatus('failed');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="page">
      <header className="page-header">
        <h1>Room booking</h1>
        <p>Meeting rooms at Storgata 14, and who has claimed them.</p>
      </header>

      {status === 'loading' && <p className="notice">Loading rooms…</p>}
      {status === 'failed' && (
        <p className="notice notice-error">
          Could not reach the API. Make sure the server is running on port 3001, then reload.
        </p>
      )}

      {status === 'ready' && (
        <main className="layout">
          <RoomList rooms={rooms} bookings={bookings} />
          <BookingForm rooms={rooms} onCreated={load} />
        </main>
      )}
    </div>
  );
}
