import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '../../shared/components/Header';
import { SavedCard } from '../../features/seats/components/SavedCard';
import { AddCardButton } from '../../features/seats/components/AddCardButton';
import { usePaymentStore } from '../../features/seats/stores/paymentStore';
import { rem } from '../../core/theme/rem';

// Mover para um service depois
const SAVED_CARDS = [
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

export default function SelectCardScreen() {
  const { type, selectedCardId } = useLocalSearchParams<{ type: string; selectedCardId: string }>();
  const setSelectedCard = usePaymentStore(state => state.setSelectedCard);

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    router.back();
  };

  const handleAddCard = () => {
    router.push('/payment/add-card');
  };

  return (
    <View style={styles.container}>
      <Header 
        title={type === 'credit' ? 'Cartões de Crédito' : 'Cartões de Débito'}
        showBackButton
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.cardsList}>
          {SAVED_CARDS.map((card) => (
            <SavedCard
              key={card.id}
              card={card}
              selected={card.id === selectedCardId}
              onPress={() => handleCardSelect(card.id)}
            />
          ))}
          
          <AddCardButton onPress={handleAddCard} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  cardsList: {
    padding: rem(1),
    gap: rem(1),
  },
}); 