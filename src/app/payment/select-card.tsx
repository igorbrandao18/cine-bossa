import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Header } from '../../shared/components/Header';
import { SavedCard } from '../../features/seats/components/SavedCard';
import { AddCardButton } from '../../features/seats/components/AddCardButton';
import { usePaymentStore } from '../../features/seats/stores/paymentStore';
import { rem } from '../../core/theme/rem';

export default function SelectCardScreen() {
  const { type, selectedCardId } = useLocalSearchParams<{ type: string; selectedCardId: string }>();
  const cards = usePaymentStore(state => state.cards);
  const setSelectedCard = usePaymentStore(state => state.setSelectedCard);
  const setSelectedMethod = usePaymentStore(state => state.setSelectedMethod);

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
    setSelectedMethod('credit');
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
          {cards.map((card) => (
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