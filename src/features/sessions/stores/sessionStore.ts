import { create } from 'zustand';
import { Session } from '../types/session';

interface SessionState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
  loadSessions: (movieId: number) => Promise<void>;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  loading: false,
  error: null,
  loadSessions: async (movieId: number) => {
    set({ loading: true, error: null });
    try {
      // Simular carregamento de sessões (substitua por sua API real)
      const mockSessions: Session[] = [
        {
          id: '1',
          movieId: movieId,
          time: '14:30',
          room: 'Sala 1 - IMAX',
          price: 45.90,
          seatTypes: ['standard', 'vip', 'imax']
        },
        {
          id: '2',
          movieId: movieId,
          time: '17:00',
          room: 'Sala 2 - Premium',
          price: 35.90,
          seatTypes: ['standard', 'vip']
        },
        {
          id: '3',
          movieId: movieId,
          time: '19:30',
          room: 'Sala 1 - IMAX',
          price: 45.90,
          seatTypes: ['standard', 'vip', 'imax']
        },
      ];
      
      set({ sessions: mockSessions, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessões', loading: false });
    }
  },
})); 