import { create } from 'zustand';
import { movieService } from '../services/tmdb';
import { cache } from '../services/cache';

interface Session {
  id: string;
  movieId: number;
  date: string;
  time: string;
  room: string;
  price: number;
  availableSeats: number;
  seatTypes: Array<'standard' | 'vip' | 'imax' | 'couple' | 'd-box'>;
}

interface SessionState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

interface SessionActions {
  loadSessions: (movieId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null
};

// Mock de dados para desenvolvimento
const mockSessions = (movieId: number): Session[] => [
  {
    id: '1',
    movieId,
    date: '2024-03-20',
    time: '14:30',
    room: 'Sala IMAX',
    price: 32.00,
    availableSeats: 48,
    seatTypes: ['imax', 'vip', 'standard']
  },
  {
    id: '2',
    movieId,
    date: '2024-03-20',
    time: '17:00',
    room: 'Sala Premium',
    price: 32.00,
    availableSeats: 36,
    seatTypes: ['d-box', 'vip', 'couple']
  },
  {
    id: '3',
    movieId,
    date: '2024-03-20',
    time: '19:30',
    room: 'Sala VIP',
    price: 36.00,
    availableSeats: 42,
    seatTypes: ['vip', 'couple', 'standard']
  },
  {
    id: '4',
    movieId,
    date: '2024-03-20',
    time: '22:00',
    room: 'Sala IMAX',
    price: 36.00,
    availableSeats: 56,
    seatTypes: ['imax', 'vip', 'standard']
  }
];

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  loadSessions: async (movieId: number) => {
    set({ loading: true, error: null });
    try {
      // TODO: Integrar com API real
      // Simulando delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const sessions = mockSessions(movieId);
      set({ sessions, loading: false });
    } catch (error: any) {
      set({ 
        error: error.message || 'Erro ao carregar sessões',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  reset: () => set(initialState)
})); 