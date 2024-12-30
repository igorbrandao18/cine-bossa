export interface Ticket {
  id: number;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  date: string;
  time: string;
  room: string;
  seats: string[];
  status: 'upcoming' | 'used' | 'cancelled';
  qrCode: string;
  price: number;
  userId: string;
  sessionId: number;
  purchaseDate: string;
}

export interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
} 