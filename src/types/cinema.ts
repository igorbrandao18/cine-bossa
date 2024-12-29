export interface Session {
  id: string;
  movieId: number;
  room: string;
  datetime: string;
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

export interface Room {
  id: string;
  name: string;
  rows: number;
  seatsPerRow: number;
} 