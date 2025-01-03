import React, { useCallback, memo } from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { usePaymentStore } from '../stores/paymentStore';
import { PaymentMethod } from './PaymentMethod';
import { AddCardButton } from './AddCardButton';
import { rem } from '../../../core/theme/rem';

const CARD_GRADIENTS = {
  visa: ['#1a1f71', '#0055b8'],
  mastercard: ['#eb001b', '#f79e1b'],
} as const;

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
] as const;

const PAYMENT_METHODS = [
  { 
    id: 'credit',
    label: 'Cartão de Crédito',
    icon: 'credit-card',
    description: 'Parcele em até 12x sem juros',
  },
  { 
    id: 'pix',
    label: 'PIX',
    icon: 'qrcode',
    description: 'Ganhe 5% de desconto à vista',
  },
  { 
    id: 'debit',
    label: 'Cartão de Débito',
    icon: 'credit-card-outline',
    description: 'Débito instantâneo sem taxas',
  }
] as const;

const SavedCardItem = memo(({ card, selected, onPress }: any) => (
  <Pressable onPress={onPress}>
    <LinearGradient
      colors={CARD_GRADIENTS[card.brand as keyof typeof CARD_GRADIENTS] || ['#333', '#666']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.cardContainer, selected && styles.selectedCard]}
    >
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="chip" size={rem(2)} color="#FFD700" />
        {selected && (
          <MaterialCommunityIcons name="check-circle" size={rem(1.5)} color="#fff" />
        )}
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
          name={`${card.brand}-card`}
          size={rem(2.5)}
          color="#fff"
          style={styles.brandIcon}
        />
      </View>
    </LinearGradient>
  </Pressable>
));

function PaymentMethodsComponent({ selectedMethod, onSelectMethod }: PaymentMethodsProps) {
  const selectedCardId = usePaymentStore(state => state.selectedCardId);
  const selectedCard = SAVED_CARDS.find(card => card.id === selectedCardId);
  
  const handleMethodPress = useCallback((methodId: string) => {
    onSelectMethod(methodId);
    
    if (methodId === 'credit' || methodId === 'debit') {
      router.push({
        pathname: '/payment/select-card',
        params: {
          type: methodId,
          selectedCardId: selectedCardId || ''
        }
      });
    }
  }, [onSelectMethod, selectedCardId]);

  const handleAddCard = useCallback(() => {
    router.push({
      pathname: "/payment/add-card"
    });
  }, []);

  const methods = PAYMENT_METHODS.map(method => ({
    ...method,
    selectedCard: (method.id === 'credit' || method.id === 'debit') ? selectedCard : undefined
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formas de Pagamento</Text>
      
      <View style={styles.methodsList}>
        {methods.map((method) => (
          <PaymentMethod
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onPress={() => handleMethodPress(method.id)}
          />
        ))}
      </View>

      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Cartões salvos</Text>
        <View style={styles.cardsList}>
          {SAVED_CARDS.map((card) => (
            <SavedCardItem
              key={card.id}
              card={card}
              selected={card.id === selectedCardId}
              onPress={() => handleMethodPress('credit')}
            />
          ))}
          <AddCardButton onPress={handleAddCard} />
        </View>
      </View>
    </View>
  );
}

export const PaymentMethods = memo(PaymentMethodsComponent);

const styles = StyleSheet.create({
  container: {
    gap: rem(1.5),
  },
  title: {
    fontSize: rem(1.125),
    color: '#fff',
    marginBottom: rem(1),
  },
  methodsList: {
    gap: rem(1),
  },
  cardsSection: {
    marginTop: rem(2),
  },
  sectionTitle: {
    fontSize: rem(1),
    color: '#fff',
    marginBottom: rem(1),
  },
  cardsList: {
    gap: rem(1),
  },
  cardContainer: {
    padding: rem(1.5),
    borderRadius: rem(1),
    height: rem(11),
    justifyContent: 'space-between',
  },
  selectedCard: {
    transform: [{ scale: 0.98 }],
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
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rem(0.75),
    padding: rem(1.5),
    borderRadius: rem(1),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E50914',
  },
  addCardText: {
    color: '#E50914',
    fontSize: rem(1),
    fontWeight: '500',
  },
}); 