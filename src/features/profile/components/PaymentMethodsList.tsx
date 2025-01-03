import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCardStore } from '../../payment/stores/cardStore';
import { rem } from '../../../core/theme/rem';
import { Button } from '../../../shared/components/Button';

const CARD_GRADIENTS = {
  visa: ['#1a1f71', '#0055b8'],
  mastercard: ['#eb001b', '#f79e1b'],
} as const;

const SavedCardItem = memo(({ card, onDelete }: any) => (
  <View style={styles.cardWrapper}>
    <LinearGradient
      colors={CARD_GRADIENTS[card.brand as keyof typeof CARD_GRADIENTS] || ['#333', '#666']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="chip" size={rem(2)} color="#FFD700" />
      </View>
      
      <Text style={styles.cardNumber}>•••• •••• •••• {card.last4}</Text>
      
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.cardLabel}>TITULAR</Text>
          <Text style={styles.cardValue}>{card.name}</Text>
        </View>
        <View>
          <Text style={styles.cardLabel}>VALIDADE</Text>
          <Text style={styles.cardValue}>{card.expiryDate}</Text>
        </View>
        <MaterialCommunityIcons
          name={card.brand === 'visa' ? 'credit-card' : 'credit-card-outline'}
          size={rem(2.5)}
          color="#fff"
          style={styles.brandIcon}
        />
      </View>
    </LinearGradient>

    <Pressable 
      style={styles.deleteButton}
      onPress={() => onDelete(card.id)}
    >
      <MaterialCommunityIcons name="delete-outline" size={rem(1.5)} color="#E50914" />
    </Pressable>
  </View>
));

export function PaymentMethodsList() {
  const { cards, removeCard } = useCardStore();

  const handleAddCard = () => {
    router.push('/payment/add-card');
  };

  const handleDeleteCard = (cardId: string) => {
    removeCard(cardId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="credit-card-multiple" size={rem(1.5)} color="#E50914" />
        <Text style={styles.title}>Formas de Pagamento</Text>
      </View>

      <View style={styles.cardsList}>
        {cards.map((card) => (
          <SavedCardItem
            key={card.id}
            card={card}
            onDelete={handleDeleteCard}
          />
        ))}

        <Button
          onPress={handleAddCard}
          variant="secondary"
          title="Adicionar novo cartão"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: rem(1.5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
  },
  title: {
    fontSize: rem(1.125),
    color: '#fff',
    fontWeight: '500',
  },
  cardsList: {
    gap: rem(1),
  },
  cardWrapper: {
    position: 'relative',
  },
  cardContainer: {
    padding: rem(1.5),
    borderRadius: rem(1),
    height: rem(11),
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    fontSize: rem(1.25),
    color: '#fff',
    letterSpacing: rem(0.2),
    fontFamily: 'monospace',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: rem(0.625),
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: rem(0.25),
  },
  cardValue: {
    fontSize: rem(0.875),
    color: '#fff',
    textTransform: 'uppercase',
  },
  brandIcon: {
    opacity: 0.9,
  },
  deleteButton: {
    position: 'absolute',
    top: rem(0.5),
    right: rem(0.5),
    padding: rem(0.5),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: rem(0.5),
  },
}); 