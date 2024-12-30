import { create } from 'zustand';
import type { Ticket, TicketState } from '../types/ticket';

interface TicketStore extends TicketState {
  addTicket: (ticket: Ticket) => void;
  updateTicketStatus: (ticketId: number, status: Ticket['status']) => void;
  loadUserTickets: (userId: string) => Promise<void>;
}

export const useTicketStore = create<TicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  error: null,

  addTicket: (ticket) => {
    set((state) => ({
      tickets: [...state.tickets, ticket],
    }));
  },

  updateTicketStatus: (ticketId, status) => {
    set((state) => ({
      tickets: state.tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status } : ticket
      ),
    }));
  },

  loadUserTickets: async (userId) => {
    set({ loading: true, error: null });
    try {
      // TODO: Implementar chamada à API
      // Por enquanto, usando dados mockados
      const mockTickets: Ticket[] = [
        {
          id: 1,
          movieId: 872585,
          movieTitle: 'Oppenheimer',
          posterPath: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
          date: '2024-01-05',
          time: '19:30',
          room: 'IMAX 1',
          seats: ['F12', 'F13'],
          status: 'upcoming',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET_001',
          price: 56.90,
          userId,
          sessionId: 1,
          purchaseDate: '2023-12-29'
        },
        {
          id: 2,
          movieId: 569094,
          movieTitle: 'Homem-Aranha: Através do Aranhaverso',
          posterPath: '/6a7NItazspSV8Fl7u46ccxwPKk4.jpg',
          date: '2023-12-28',
          time: '21:00',
          room: 'Sala 3',
          seats: ['D5'],
          status: 'used',
          qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TICKET_002',
          price: 32.90,
          userId,
          sessionId: 2,
          purchaseDate: '2023-12-15'
        }
      ];

      set({ tickets: mockTickets });
    } catch (error) {
      set({ error: 'Erro ao carregar ingressos' });
    } finally {
      set({ loading: false });
    }
  },
})); 