import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid';
import type { Ticket, TicketService } from '../types/ticket';

const STORAGE_KEY = '@cine-bossa:tickets';

class LocalTicketService implements TicketService {
  async getTickets(): Promise<Ticket[]> {
    try {
      const ticketsJson = await AsyncStorage.getItem(STORAGE_KEY);
      return ticketsJson ? JSON.parse(ticketsJson) : [];
    } catch (error) {
      console.error('Error getting tickets:', error);
      throw error;
    }
  }

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const tickets = await this.getTickets();
      const ticket = tickets.find((t) => t.id === id);
      if (!ticket) {
        throw new Error('Ticket not found');
      }
      return ticket;
    } catch (error) {
      console.error('Error getting ticket by id:', error);
      throw error;
    }
  }

  async createTicket(ticket: Omit<Ticket, 'id' | 'qrCode' | 'status'>): Promise<Ticket> {
    try {
      const tickets = await this.getTickets();
      const newTicket: Ticket = {
        ...ticket,
        id: nanoid(),
        qrCode: this.generateQRCode(ticket),
        status: 'valid',
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...tickets, newTicket]));
      return newTicket;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  }

  async updateTicketStatus(id: string, status: Ticket['status']): Promise<Ticket> {
    try {
      const tickets = await this.getTickets();
      const ticketIndex = tickets.findIndex((t) => t.id === id);
      if (ticketIndex === -1) {
        throw new Error('Ticket not found');
      }
      const updatedTicket = {
        ...tickets[ticketIndex],
        status,
      };
      tickets[ticketIndex] = updatedTicket;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
      return updatedTicket;
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  }

  async deleteTicket(id: string): Promise<void> {
    try {
      const tickets = await this.getTickets();
      const filteredTickets = tickets.filter((t) => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTickets));
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }

  private generateQRCode(ticket: Omit<Ticket, 'id' | 'qrCode' | 'status'>): string {
    // Generate a unique QR code based on ticket information
    const qrData = {
      ...ticket,
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  }
}

export const ticketService = new LocalTicketService(); 