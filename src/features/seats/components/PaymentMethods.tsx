import React, { useCallback, memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePaymentStore } from '../stores/paymentStore';
import { PaymentMethod } from './PaymentMethod';
import { SavedCard } from './SavedCard';
import { RadioButton } from './RadioButton';
import { rem } from '../../../core/theme/rem';

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
  },
  { 
    id: 'pix',
    label: 'PIX',
    icon: 'qrcode',
  },
  { 
    id: 'debit',
    label: 'Cartão de Débito',
    icon: 'credit-card-outline',
  }
] as const;

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

function PaymentMethodsComponent({ selectedMethod, onSelectMethod }: PaymentMethodsProps) {
  const selectedCardId = usePaymentStore(state => state.selectedCardId);
  
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

  const selectedCard = SAVED_CARDS.find(card => card.id === selectedCardId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formas de Pagamento</Text>
      
      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map((method) => (
          <PaymentMethod
            key={method.id}
            method={method}
            selected={selectedMethod === method.id}
            onPress={() => handleMethodPress(method.id)}
          />
        ))}
      </View>

      {selectedCard && (selectedMethod === 'credit' || selectedMethod === 'debit') && (
        <View style={styles.selectedCardContainer}>
          <Text style={styles.selectedCardTitle}>Cartão Selecionado</Text>
          <Pressable 
            style={styles.selectedCardButton}
            onPress={() => handleMethodPress(selectedMethod)}
          >
            <View style={styles.cardInfo}>
              <MaterialCommunityIcons
                name={`${selectedCard.brand}-card` as any}
                size={rem(1.5)}
                color="#999"
              />
              <View style={styles.cardTextInfo}>
                <Text style={styles.cardNumber}>•••• {selectedCard.last4}</Text>
                <Text style={styles.cardExpiry}>Expira em {selectedCard.expiryDate}</Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={rem(1.5)}
              color="#666"
            />
          </Pressable>
        </View>
      )}
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
  selectedCardContainer: {
    marginTop: rem(1.5),
    gap: rem(0.75),
  },
  selectedCardTitle: {
    fontSize: rem(0.875),
    color: '#999',
  },
  selectedCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rem(1),
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.5),
    borderWidth: 1,
    borderColor: '#333',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  cardTextInfo: {
    gap: rem(0.25),
  },
  cardNumber: {
    fontSize: rem(1),
    color: '#fff',
    fontWeight: '500',
  },
  cardExpiry: {
    fontSize: rem(0.875),
    color: '#999',
  },
}); 