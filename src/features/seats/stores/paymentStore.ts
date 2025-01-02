import { create } from 'zustand';

interface PaymentStore {
  selectedCardId: string | null;
  selectedMethod: string | null;
  setSelectedCard: (cardId: string | null) => void;
  setSelectedMethod: (method: string | null) => void;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  selectedCardId: null,
  selectedMethod: null,
  setSelectedCard: (cardId) => set({ selectedCardId: cardId }),
  setSelectedMethod: (method) => set({ selectedMethod: method }),
})); 