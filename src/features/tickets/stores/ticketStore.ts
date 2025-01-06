import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ticket {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  room: string;
  seats: string[];
  price: number;
  purchaseDate: string;
}

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  addTicket: (ticket: Omit<Ticket, 'id' | 'purchaseDate'>) => void;
  loadTickets: () => Promise<void>;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  addTicket: (ticketData) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Math.random().toString(36).substring(7),
      purchaseDate: new Date().toISOString(),
    };

    set((state) => ({
      tickets: [...state.tickets, newTicket],
    }));

    // Salvar no AsyncStorage
    try {
      const tickets = [...get().tickets, newTicket];
      AsyncStorage.setItem('@CineBossa:tickets', JSON.stringify(tickets));
    } catch (error) {
      console.error('Erro ao salvar tickets:', error);
    }
  },

  loadTickets: async () => {
    set({ loading: true, error: null });

    try {
      // Carregar do AsyncStorage
      const storedTickets = await AsyncStorage.getItem('@CineBossa:tickets');
      
      if (storedTickets) {
        set({ tickets: JSON.parse(storedTickets), loading: false });
      } else {
        set({ tickets: [], loading: false });
      }
    } catch (error) {
      set({ 
        error: 'Erro ao carregar ingressos. Tente novamente.',
        loading: false 
      });
    }
  },
})); 