export interface Ticket {
  id: string;
  movieId: number;
  movieTitle: string;
  posterPath: string;
  date: string;
  time: string;
  room: string;
  seats: string[];
  status: 'valid' | 'used' | 'expired';
  qrCode: string;
  price: number;
  userId: string;
  sessionId: string;
  purchaseDate: string;
}

export interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

export interface TicketService {
  getTickets: () => Promise<Ticket[]>;
  getTicketById: (id: string) => Promise<Ticket>;
  createTicket: (ticket: Omit<Ticket, 'id' | 'qrCode' | 'status'>) => Promise<Ticket>;
  updateTicketStatus: (id: string, status: Ticket['status']) => Promise<Ticket>;
  deleteTicket: (id: string) => Promise<void>;
}

export interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  loadTickets: () => Promise<void>;
  addTicket: (ticket: Omit<Ticket, 'id' | 'qrCode' | 'status'>) => Promise<void>;
  updateTicketStatus: (id: string, status: Ticket['status']) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  clearTickets: () => void;
  setError: (error: string | null) => void;
} 