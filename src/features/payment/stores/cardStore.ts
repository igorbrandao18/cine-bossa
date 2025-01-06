import { create } from 'zustand';

export interface Card {
  id: string;
  last4: string;
  brand: 'visa' | 'mastercard';
  name: string;
  expiryDate: string;
  number: string;
}

interface CardState {
  cards: Card[];
  addCard: (card: Omit<Card, 'id' | 'last4'>) => void;
  removeCard: (cardId: string) => void;
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  
  addCard: (card) => {
    set((state) => {
      const id = `card-${Date.now()}`;
      const last4 = card.number.slice(-4);
      
      const newCard: Card = {
        ...card,
        id,
        last4,
      };

      return {
        cards: [...state.cards, newCard],
      };
    });
  },

  removeCard: (cardId) => {
    set((state) => ({
      cards: state.cards.filter((card) => card.id !== cardId),
    }));
  },
})); 