import React, { useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { usePaymentStore } from '../stores/paymentStore';
import { PaymentMethod } from './PaymentMethod';
import { Button } from '../../../shared/components/Button';
import { rem } from '../../../core/theme/rem';

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

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
  totalPrice: number;
  onFinishPurchase: () => void;
  movieTitle?: string;
}

function PaymentMethodsComponent({ 
  selectedMethod, 
  onSelectMethod,
  totalPrice,
  onFinishPurchase,
  movieTitle
}: PaymentMethodsProps) {
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

  const methods = PAYMENT_METHODS.map(method => ({
    ...method,
  }));

  return (
    <View style={styles.container}>
      {movieTitle && (
        <Text style={styles.movieTitle}>{movieTitle}</Text>
      )}
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

      <View style={styles.checkoutSection}>
        <View style={styles.totalPrice}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            R$ {totalPrice.toFixed(2)}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Finalizar Compra"
            onPress={onFinishPurchase}
            disabled={!selectedMethod}
            fullWidth
          />
          <MaterialCommunityIcons 
            name="ticket-confirmation" 
            size={rem(1.5)} 
            color="#fff" 
            style={styles.buttonIcon}
          />
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
  checkoutSection: {
    marginTop: rem(2),
    gap: rem(1),
    paddingTop: rem(2),
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: rem(1),
    color: '#999',
  },
  totalValue: {
    fontSize: rem(1.5),
    color: '#fff',
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'relative',
  },
  buttonIcon: {
    position: 'absolute',
    right: rem(1),
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  movieTitle: {
    fontSize: rem(1.25),
    color: '#fff',
    fontWeight: '600',
    marginBottom: rem(1.5),
  },
}); 