export interface Session {
  id: string;
  movieId: number;
  movieTitle: string;
  date: string;
  time: string;
  room: string;
  price: number;
  seats: Seat[];
  status: 'scheduled' | 'in_progress' | 'finished' | 'cancelled';
  technology: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  status: 'available' | 'reserved' | 'occupied';
  type: 'standard' | 'wheelchair' | 'companion' | 'couple' | 'premium';
  price: number;
}

export interface SeatMap {
  rows: string[];
  columns: number;
  seats: Seat[];
  unavailableSeats: string[];
  wheelchairSeats: string[];
  companionSeats: string[];
}

export interface SessionState {
  sessions: Session[];
  selectedSession: Session | null;
  selectedSeats: Seat[];
  loading: boolean;
  error: string | null;
}

export interface SessionService {
  getSessions: (movieId: number) => Promise<Session[]>;
  getSessionById: (id: string) => Promise<Session>;
  createSession: (session: Omit<Session, 'id'>) => Promise<Session>;
  updateSession: (id: string, session: Partial<Session>) => Promise<Session>;
  deleteSession: (id: string) => Promise<void>;
  reserveSeats: (sessionId: string, seats: string[]) => Promise<void>;
  releaseSeats: (sessionId: string, seats: string[]) => Promise<void>;
}

export interface SessionStore {
  sessions: Session[];
  selectedSession: Session | null;
  selectedSeats: Seat[];
  loading: boolean;
  error: string | null;
  loadSessions: (movieId: number) => Promise<void>;
  selectSession: (session: Session) => void;
  selectSeat: (seat: Seat) => void;
  unselectSeat: (seat: Seat) => void;
  clearSelectedSeats: () => void;
  reserveSeats: (sessionId: string, seats: string[]) => Promise<void>;
  releaseSeats: (sessionId: string, seats: string[]) => Promise<void>;
  setError: (error: string | null) => void;
} 