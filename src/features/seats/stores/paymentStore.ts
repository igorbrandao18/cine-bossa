import { create } from 'zustand';

interface Card {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard';
  name: string;
  expiryDate: string;
}

interface PaymentStore {
  selectedCardId: string | null;
  selectedMethod: string | null;
  cards: Card[];
  setSelectedCard: (cardId: string | null) => void;
  setSelectedMethod: (method: string | null) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
}

// Cartões iniciais para teste
const initialCards: Card[] = [
  {
    id: 'card1',
    last4: '4567',
    brand: 'visa',
    name: 'João Silva',
    expiryDate: '12/25'
  },
  {
    id: 'card2',
    last4: '8901',
    brand: 'mastercard',
    name: 'João Silva',
    expiryDate: '08/24'
  }
];

export const usePaymentStore = create<PaymentStore>((set) => ({
  selectedCardId: null,
  selectedMethod: null,
  cards: initialCards, // Usando os cartões iniciais
  setSelectedCard: (cardId) => set({ selectedCardId: cardId }),
  setSelectedMethod: (method) => set({ selectedMethod: method }),
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  removeCard: (cardId) => set((state) => ({ cards: state.cards.filter(card => card.id !== cardId) })),
})); 