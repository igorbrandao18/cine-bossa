import { create } from 'zustand';

export interface Seat {
  id: string;
  number: string;
  price: number;
  status: 'available' | 'selected' | 'occupied';
}

interface SeatStore {
  selectedSeats: Seat[];
  totalPrice: number;
  selectSeat: (seat: Seat) => void;
  unselectSeat: (seatId: string) => void;
  clearSelection: () => void;
}

export const useSeatStore = create<SeatStore>((set) => ({
  selectedSeats: [],
  totalPrice: 0,
  
  selectSeat: (seat) => set((state) => {
    const newSelectedSeats = [...state.selectedSeats, seat];
    return {
      selectedSeats: newSelectedSeats,
      totalPrice: newSelectedSeats.reduce((total, seat) => total + seat.price, 0),
    };
  }),
  
  unselectSeat: (seatId) => set((state) => {
    const newSelectedSeats = state.selectedSeats.filter(seat => seat.id !== seatId);
    return {
      selectedSeats: newSelectedSeats,
      totalPrice: newSelectedSeats.reduce((total, seat) => total + seat.price, 0),
    };
  }),
  
  clearSelection: () => set({
    selectedSeats: [],
    totalPrice: 0,
  }),
})); 