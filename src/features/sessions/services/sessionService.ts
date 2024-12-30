import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import type { Session, SessionService, Seat } from '../types/session';

const STORAGE_KEY = '@cine-bossa:sessions';

class LocalSessionService implements SessionService {
  async getSessions(movieId: number): Promise<Session[]> {
    try {
      const sessionsJson = await AsyncStorage.getItem(STORAGE_KEY);
      const sessions = sessionsJson ? JSON.parse(sessionsJson) : [];
      return sessions.filter((s: Session) => s.movieId === movieId);
    } catch (error) {
      console.error('Error getting sessions:', error);
      throw error;
    }
  }

  async getSessionById(id: string): Promise<Session> {
    try {
      const sessions = await this.getAllSessions();
      const session = sessions.find((s) => s.id === id);
      if (!session) {
        throw new Error('Session not found');
      }
      return session;
    } catch (error) {
      console.error('Error getting session by id:', error);
      throw error;
    }
  }

  async createSession(session: Omit<Session, 'id'>): Promise<Session> {
    try {
      const sessions = await this.getAllSessions();
      const newSession: Session = {
        ...session,
        id: nanoid(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...sessions, newSession]));
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  async updateSession(id: string, sessionUpdate: Partial<Session>): Promise<Session> {
    try {
      const sessions = await this.getAllSessions();
      const sessionIndex = sessions.findIndex((s) => s.id === id);
      if (sessionIndex === -1) {
        throw new Error('Session not found');
      }
      const updatedSession = {
        ...sessions[sessionIndex],
        ...sessionUpdate,
      };
      sessions[sessionIndex] = updatedSession;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      return updatedSession;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async deleteSession(id: string): Promise<void> {
    try {
      const sessions = await this.getAllSessions();
      const filteredSessions = sessions.filter((s) => s.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSessions));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  async reserveSeats(sessionId: string, seats: string[]): Promise<void> {
    try {
      const session = await this.getSessionById(sessionId);
      const updatedSeats = session.seats.map((seat) => {
        if (seats.includes(`${seat.row}${seat.number}`)) {
          return { ...seat, status: 'reserved' as const };
        }
        return seat;
      });
      await this.updateSession(sessionId, { seats: updatedSeats });
    } catch (error) {
      console.error('Error reserving seats:', error);
      throw error;
    }
  }

  async releaseSeats(sessionId: string, seats: string[]): Promise<void> {
    try {
      const session = await this.getSessionById(sessionId);
      const updatedSeats = session.seats.map((seat) => {
        if (seats.includes(`${seat.row}${seat.number}`)) {
          return { ...seat, status: 'available' as const };
        }
        return seat;
      });
      await this.updateSession(sessionId, { seats: updatedSeats });
    } catch (error) {
      console.error('Error releasing seats:', error);
      throw error;
    }
  }

  private async getAllSessions(): Promise<Session[]> {
    const sessionsJson = await AsyncStorage.getItem(STORAGE_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  }
}

export const sessionService = new LocalSessionService(); 