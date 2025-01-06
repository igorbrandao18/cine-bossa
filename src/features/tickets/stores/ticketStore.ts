import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  posterPath: string;
  date: string;
  time: string;
  room: string;
  technology: string;
  seats: string[];
  price: number;
  status?: 'VALID' | 'USED' | 'EXPIRED';
  purchaseDate: string;
  paymentMethod: {
    type: 'CREDIT' | 'DEBIT' | 'PIX';
    lastDigits?: string;
  };
}

// Mock de ingressos para teste
const mockTickets: Ticket[] = [
  {
    id: '1',
    movieId: '1',
    movieTitle: 'Duna: Parte 2',
    posterPath: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    date: '15/03/2024',
    time: '19:00',
    room: 'Sala 1',
    technology: 'IMAX',
    seats: ['A01', 'A02'],
    price: 90.00,
    status: 'VALID',
    purchaseDate: new Date().toISOString(),
    paymentMethod: {
      type: 'CREDIT',
      lastDigits: '4389'
    }
  },
  {
    id: '2',
    movieId: '2',
    movieTitle: 'Kung Fu Panda 4',
    posterPath: '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    date: '14/03/2024',
    time: '15:30',
    room: 'Sala 3',
    technology: '3D',
    seats: ['C04', 'C05', 'C06'],
    price: 105.00,
    status: 'USED',
    purchaseDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: {
      type: 'DEBIT',
      lastDigits: '2547'
    }
  },
  {
    id: '3',
    movieId: '3',
    movieTitle: 'Pobres Criaturas',
    posterPath: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg',
    date: '10/03/2024',
    time: '21:00',
    room: 'Sala VIP',
    technology: 'VIP',
    seats: ['E04'],
    price: 50.00,
    status: 'EXPIRED',
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: {
      type: 'PIX'
    }
  },
  {
    id: '4',
    movieId: '4',
    movieTitle: 'Demon Slayer: Hashira Training',
    posterPath: '/jDQPkgzerGophKRRn7MKm071vCU.jpg',
    date: '16/03/2024',
    time: '18:30',
    room: 'Sala 5',
    technology: 'D-BOX',
    seats: ['B03', 'B04'],
    price: 80.00,
    status: 'VALID',
    purchaseDate: new Date().toISOString(),
    paymentMethod: {
      type: 'CREDIT',
      lastDigits: '1234'
    }
  }
];

interface TicketStore {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
  addTicket: (ticket: Omit<Ticket, 'id' | 'purchaseDate'>) => void;
  loadTickets: () => Promise<void>;
  clearTickets: () => Promise<void>;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  clearTickets: async () => {
    try {
      await AsyncStorage.removeItem('@CineBossa:tickets');
      set({ tickets: [], loading: false, error: null });
    } catch (error) {
      console.error('Erro ao limpar tickets:', error);
    }
  },

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
    set({ loading: true });
    try {
      // Carregar do AsyncStorage
      const storedTickets = await AsyncStorage.getItem('@CineBossa:tickets');
      
      // Se não houver tickets salvos, usar os mock tickets
      if (!storedTickets) {
        console.log('Nenhum ticket encontrado, carregando mocks...');
        await AsyncStorage.setItem('@CineBossa:tickets', JSON.stringify(mockTickets));
        set({ tickets: mockTickets, loading: false });
        return;
      }
      
      const parsedTickets = JSON.parse(storedTickets);
      console.log('Tickets carregados:', parsedTickets.length);
      
      // Se não houver tickets salvos, usar os mock tickets
      if (!parsedTickets || parsedTickets.length === 0) {
        console.log('Array de tickets vazio, carregando mocks...');
        await AsyncStorage.setItem('@CineBossa:tickets', JSON.stringify(mockTickets));
        set({ tickets: mockTickets, loading: false });
        return;
      }
      
      set({ tickets: parsedTickets, loading: false });
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      set({ error: 'Erro ao carregar tickets', loading: false });
      
      // Em caso de erro, tentar carregar os mocks
      await AsyncStorage.setItem('@CineBossa:tickets', JSON.stringify(mockTickets));
      set({ tickets: mockTickets, loading: false });
    }
  },
})); 