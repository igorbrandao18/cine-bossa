import { create } from 'zustand';

export type SessionType = 'imax' | '3d' | 'dbox' | 'vip' | 'standard';

export interface Seat {
  id: string;
  row: string;
  number: string;
  type: 'standard' | 'couple' | 'premium' | 'wheelchair';
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

interface Session {
  id: string;
  movieId: string;
  movieTitle: string;
  room: string;
  technology: string;
  time: string;
  seats: Seat[];
  price: number;
  type: string;
  seatTypes: SessionType[];
}

interface SessionState {
  currentSession: Session | null;
  sessions: Session[];
  loading: boolean;
  error: string | null;
  fetchSession: (sessionId: string) => Promise<void>;
  loadSessions: (movieId: number) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: null,
  sessions: [],
  loading: false,
  error: null,
  fetchSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await mockFetchSession(sessionId);
      set({ currentSession: response, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessão', loading: false });
    }
  },
  loadSessions: async (movieId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await mockLoadSessions(movieId);
      set({ sessions: response, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessões', loading: false });
    }
  }
}));

// Mock para carregar lista de sessões
const mockLoadSessions = async (movieId: number): Promise<Session[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          movieId: String(movieId),
          movieTitle: 'Wonka',
          room: 'Sala 1',
          technology: 'IMAX',
          time: '14:30',
          seats: generateSeats(),
          price: 45.00,
          type: 'IMAX 3D',
          seatTypes: ['imax', '3d'],
        },
        {
          id: '2',
          movieId: String(movieId),
          movieTitle: 'Wonka',
          room: 'Sala 2',
          technology: '3D',
          time: '16:45',
          seats: generateSeats(),
          price: 35.00,
          type: '3D',
          seatTypes: ['3d', 'dbox'],
        },
        {
          id: '3',
          movieId: String(movieId),
          movieTitle: 'Wonka',
          room: 'Sala 3',
          technology: '2D',
          time: '19:00',
          seats: generateSeats(),
          price: 25.00,
          type: '2D',
          seatTypes: ['standard', 'vip'],
        },
      ]);
    }, 1000);
  });
};

// Mock temporário - substituir por API real
const mockFetchSession = async (sessionId: string): Promise<Session> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: sessionId,
        movieId: '1',
        movieTitle: 'Wonka',
        room: 'Sala 1',
        technology: 'IMAX',
        time: '14:30',
        seats: generateSeats(),
        price: 45.00,
        type: 'IMAX 3D',
        seatTypes: ['imax', '3d'],
      });
    }, 1000);
  });
};

const generateSeats = () => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
  rows.forEach(row => {
    for (let i = 1; i <= 8; i++) {
      const number = String(i).padStart(2, '0');
      const id = `${row}${number}`;
      
      let type: Seat['type'] = 'standard';
      if (['G02', 'G06'].includes(id)) type = 'couple';
      if (['E04', 'E05', 'F04', 'F05'].includes(id)) type = 'premium';
      if (['G01', 'G03', 'G05'].includes(id)) type = 'wheelchair';
      
      seats.push({
        id,
        row,
        number,
        type,
        status: Math.random() > 0.8 ? 'occupied' : 'available',
        price: type === 'couple' ? 70 : type === 'premium' ? 45 : 35,
      });
    }
  });
  
  return seats;
}; 