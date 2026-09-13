export type Room = {
  id: number;
  name: string;
  floor: number;
  capacity: number;
};

export type Booking = {
  id: number;
  roomId: number;
  title: string;
  bookedBy: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
};

export type NewBooking = {
  roomId: number;
  title: string;
  bookedBy: string;
  startsAt: string;
  endsAt: string;
};

export type NewBookingSeries = NewBooking & {
  /** Siste forekomst i serien starter ikke senere enn dette tidspunktet. */
  repeatUntil: string;
};
