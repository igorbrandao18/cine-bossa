import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Seat {
  id: string;
  row: string;
  number: number;
  price: number;
}

interface Session {
  id: string;
  movieId: string;
  movieTitle: string;
  room: string;
  time: string;
  date: string;
}

interface PurchaseStore {
  // Estado
  selectedSeats: Seat[];
  session: Session | null;
  totalAmount: number;
  
  // Ações
  setSession: (session: Session) => void;
  addSeat: (seat: Seat) => void;
  removeSeat: (seatId: string) => void;
  clearSeats: () => void;
  resetPurchase: () => void;
  
  // Computados
  getTotalAmount: () => number;
}

export const usePurchaseStore = create<PurchaseStore>()(
  persist(
    (set, get) => ({
      selectedSeats: [],
      session: null,
      totalAmount: 0,

      setSession: (session) => {
        set({ session });
      },

      addSeat: (seat) => {
        set((state) => ({
          selectedSeats: [...state.selectedSeats, seat],
          totalAmount: state.totalAmount + seat.price,
        }));
      },

      removeSeat: (seatId) => {
        set((state) => {
          const seat = state.selectedSeats.find((s) => s.id === seatId);
          return {
            selectedSeats: state.selectedSeats.filter((s) => s.id !== seatId),
            totalAmount: state.totalAmount - (seat?.price || 0),
          };
        });
      },

      clearSeats: () => {
        set({ selectedSeats: [], totalAmount: 0 });
      },

      resetPurchase: () => {
        set({ selectedSeats: [], session: null, totalAmount: 0 });
      },

      getTotalAmount: () => {
        return get().totalAmount;
      },
    }),
    {
      name: 'purchase-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
); 