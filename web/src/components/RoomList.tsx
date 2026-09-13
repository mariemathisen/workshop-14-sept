import type { Booking, Room } from '../types.ts';

type Props = {
  rooms: Room[];
  bookings: Booking[];
};

const dayFormat = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});
const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' });

function formatRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);
  return `${dayFormat.format(start)} ${timeFormat.format(start)}–${timeFormat.format(end)}`;
}

export function RoomList({ rooms, bookings }: Props) {
  return (
    <section className="rooms">
      <h2>Rooms</h2>
      <ul className="room-list">
        {rooms.map((room) => {
          const roomBookings = bookings.filter((booking) => booking.roomId === room.id);

          return (
            <li key={room.id} className="room">
              <div className="room-head">
                <h3>{room.name}</h3>
                <span className="room-meta">
                  Floor {room.floor} · seats {room.capacity}
                </span>
              </div>

              {roomBookings.length === 0 ? (
                <p className="room-empty">Free all week.</p>
              ) : (
                <ul className="booking-list">
                  {roomBookings.map((booking) => (
                    <li key={booking.id} className="booking">
                      <span className="booking-time">
                        {formatRange(booking.startsAt, booking.endsAt)}
                      </span>
                      <span className="booking-title">{booking.title}</span>
                      <span className="booking-owner">{booking.bookedBy}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
