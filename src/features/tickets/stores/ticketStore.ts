import { create } from 'zustand';
import type { TicketStore } from '../types/ticket';
import { ticketService } from '../services/ticketService';

export const useTicketStore = create<TicketStore>((set) => ({
  tickets: [],
  loading: false,
  error: null,

  loadTickets: async () => {
    try {
      set({ loading: true, error: null });
      const tickets = await ticketService.getTickets();
      set({ tickets, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load tickets',
        loading: false,
      });
    }
  },

  addTicket: async (ticket) => {
    try {
      set({ loading: true, error: null });
      const newTicket = await ticketService.createTicket(ticket);
      set((state) => ({
        tickets: [...state.tickets, newTicket],
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add ticket',
        loading: false,
      });
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      set({ loading: true, error: null });
      const updatedTicket = await ticketService.updateTicketStatus(id, status);
      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === id ? updatedTicket : t
        ),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update ticket',
        loading: false,
      });
    }
  },

  deleteTicket: async (id) => {
    try {
      set({ loading: true, error: null });
      await ticketService.deleteTicket(id);
      set((state) => ({
        tickets: state.tickets.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete ticket',
        loading: false,
      });
    }
  },

  clearTickets: () => {
    set({ tickets: [], error: null });
  },

  setError: (error) => {
    set({ error });
  },
})); 