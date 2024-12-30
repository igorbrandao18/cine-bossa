import { create } from 'zustand';
import type { SessionStore } from '../types/session';
import { sessionService } from '../services/sessionService';

export const useSessionStore = create<SessionStore>((set) => ({
  sessions: [],
  selectedSession: null,
  selectedSeats: [],
  loading: false,
  error: null,

  loadSessions: async (movieId) => {
    try {
      set({ loading: true, error: null });
      const sessions = await sessionService.getSessions(movieId);
      set({ sessions, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load sessions',
        loading: false,
      });
    }
  },

  selectSession: (session) => {
    set({ selectedSession: session, selectedSeats: [] });
  },

  selectSeat: (seat) => {
    set((state) => ({
      selectedSeats: [...state.selectedSeats, seat],
    }));
  },

  unselectSeat: (seat) => {
    set((state) => ({
      selectedSeats: state.selectedSeats.filter(
        (s) => !(s.row === seat.row && s.number === seat.number)
      ),
    }));
  },

  clearSelectedSeats: () => {
    set({ selectedSeats: [] });
  },

  reserveSeats: async (sessionId, seats) => {
    try {
      set({ loading: true, error: null });
      await sessionService.reserveSeats(sessionId, seats);
      const updatedSession = await sessionService.getSessionById(sessionId);
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === sessionId ? updatedSession : s
        ),
        selectedSession: updatedSession,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reserve seats',
        loading: false,
      });
    }
  },

  releaseSeats: async (sessionId, seats) => {
    try {
      set({ loading: true, error: null });
      await sessionService.releaseSeats(sessionId, seats);
      const updatedSession = await sessionService.getSessionById(sessionId);
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === sessionId ? updatedSession : s
        ),
        selectedSession: updatedSession,
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to release seats',
        loading: false,
      });
    }
  },

  setError: (error) => {
    set({ error });
  },
})); 