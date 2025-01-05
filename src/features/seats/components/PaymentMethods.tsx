import React, { useCallback, memo, useEffect } from 'react';
import { View, StyleSheet, Animated, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { usePaymentStore } from '../stores/paymentStore';
import { Button } from '../../../shared/components/Button';
import { rem } from '../../../core/theme/rem';
import { LinearGradient } from 'expo-linear-gradient';

const PAYMENT_METHODS = [
  { 
    id: 'credit',
    label: 'Cartão de Crédito',
    icon: 'credit-card',
    description: 'Parcele em até 12x sem juros',
    gradient: ['#E50914', '#831010']
  },
  { 
    id: 'pix',
    label: 'PIX',
    icon: 'qrcode',
    description: 'Ganhe 5% de desconto à vista',
    gradient: ['#00875F', '#015F43']
  },
  { 
    id: 'debit',
    label: 'Cartão de Débito',
    icon: 'credit-card-outline',
    description: 'Débito instantâneo sem taxas',
    gradient: ['#E50914', '#831010']
  }
] as const;

interface PaymentMethodsProps {
  selectedMethod: string;
  onSelectMethod: (methodId: string) => void;
  totalPrice: number;
  onFinishPurchase: () => void;
}

function PaymentMethodsComponent({ 
  selectedMethod, 
  onSelectMethod,
  totalPrice,
  onFinishPurchase
}: PaymentMethodsProps) {
  // Estados do store com seletores específicos para melhor performance
  const selectedCardId = usePaymentStore(state => state.selectedCardId);
  const savedCards = usePaymentStore(state => state.cards);
  const setSelectedMethod = usePaymentStore(state => state.setSelectedMethod);
  const setSelectedCard = usePaymentStore(state => state.setSelectedCard);

  // Estado local para forçar atualização
  const [updateKey, setUpdateKey] = React.useState(0);
  
  // Encontra o cartão selecionado com memoização
  const selectedCard = React.useMemo(() => 
    selectedCardId ? savedCards.find(card => card.id === selectedCardId) : null
  , [selectedCardId, savedCards, updateKey]);

  // Atualiza quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      if (selectedCardId) {
        // Força método como crédito
        setSelectedMethod('credit');
        onSelectMethod('credit');
        // Força atualização do componente
        setUpdateKey(prev => prev + 1);
      }
    }, [selectedCardId, setSelectedMethod, onSelectMethod])
  );

  // Monitora mudanças no cartão selecionado
  useEffect(() => {
    if (selectedCardId) {
      setSelectedMethod('credit');
      onSelectMethod('credit');
      setUpdateKey(prev => prev + 1);
    }
  }, [selectedCardId, setSelectedMethod, onSelectMethod]);

  const handleMethodPress = useCallback((methodId: string) => {
    if (methodId === 'credit' || methodId === 'debit') {
      router.push({
        pathname: '/payment/select-card',
        params: {
          type: methodId,
          selectedCardId: selectedCardId || ''
        }
      });
    } else {
      onSelectMethod(methodId);
      setSelectedMethod(methodId);
      setSelectedCard(null);
    }
  }, [onSelectMethod, selectedCardId, setSelectedCard, setSelectedMethod]);

  const renderCardSection = useCallback((method: typeof PAYMENT_METHODS[number]) => {
    const isCardMethod = method.id === 'credit' || method.id === 'debit';
    
    // Se não for método de cartão, mostra só a descrição
    if (!isCardMethod) {
      return (
        <Text style={styles.methodDescription}>
          {method.description}
        </Text>
      );
    }

    // Se tiver cartão selecionado
    if (selectedCard) {
      return (
        <View style={styles.selectedCardInfo}>
          <Text style={styles.cardName}>
            {selectedCard.name}
          </Text>
          <Text style={styles.cardDetails}>
            •••• {selectedCard.last4} | {selectedCard.brand.toUpperCase()}
          </Text>
          <Pressable 
            style={styles.changeCard}
            onPress={() => handleMethodPress(method.id)}
          >
            <MaterialCommunityIcons
              name="credit-card-edit"
              size={rem(1)}
              color="#fff"
            />
            <Text style={styles.changeCardText}>
              Trocar cartão
            </Text>
          </Pressable>
        </View>
      );
    }

    // Se não tiver cartão selecionado
    return (
      <>
        <Text style={styles.methodDescription}>
          {method.description}
        </Text>
        <Pressable 
          style={styles.addCardButton}
          onPress={() => handleMethodPress(method.id)}
        >
          <MaterialCommunityIcons
            name="credit-card-plus"
            size={rem(1.25)}
            color="#fff"
          />
          <Text style={styles.addCardText}>
            Adicionar Cartão
          </Text>
        </Pressable>
      </>
    );
  }, [selectedCard, handleMethodPress]);

  const renderMethod = useCallback((method: typeof PAYMENT_METHODS[number]) => {
    const isSelected = selectedMethod === method.id;
    const hasSelectedCard = selectedCard && (method.id === 'credit' || method.id === 'debit');

    return (
      <Pressable
        key={method.id}
        onPress={() => handleMethodPress(method.id)}
      >
        <LinearGradient
          colors={method.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.methodCard,
            isSelected && styles.selectedMethod,
            hasSelectedCard && styles.hasCard
          ]}
        >
          <View style={styles.methodHeader}>
            <MaterialCommunityIcons
              name={hasSelectedCard ? 'credit-card-check' : method.icon}
              size={rem(1.75)}
              color="#fff"
            />
            {isSelected && (
              <MaterialCommunityIcons
                name="check-circle"
                size={rem(1.25)}
                color="#fff"
              />
            )}
          </View>

          <View style={styles.methodContent}>
            <Text style={styles.methodLabel}>{method.label}</Text>
            {renderCardSection(method)}
          </View>
        </LinearGradient>
      </Pressable>
    );
  }, [selectedMethod, selectedCard, handleMethodPress, renderCardSection]);

  const handleFinishPurchase = useCallback(() => {
    if (selectedMethod === 'pix') {
      router.push({
        pathname: '/(stack)/pix',
        params: {
          amount: (totalPrice * 0.95).toFixed(2)
        }
      } as any);
    } else {
      onFinishPurchase();
    }
  }, [selectedMethod, totalPrice, onFinishPurchase]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formas de Pagamento</Text>
      
      <View style={styles.methodsList}>
        {PAYMENT_METHODS.map(renderMethod)}
      </View>

      {selectedMethod === 'pix' && (
        <View style={styles.pixSection}>
          <LinearGradient
            colors={['#00875F', '#015F43']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pixContainer}
          >
            <View style={styles.pixInfo}>
              <View style={styles.pixRow}>
                <MaterialCommunityIcons 
                  name="percent" 
                  size={rem(1.25)} 
                  color="#fff" 
                />
                <Text style={styles.pixDiscount}>
                  5% de desconto no PIX
                </Text>
              </View>
              <Text style={styles.pixInstructions}>
                QR Code gerado após confirmação
              </Text>
            </View>
          </LinearGradient>
        </View>
      )}

      <View style={styles.checkoutSection}>
        <View style={styles.totalPrice}>
          <Text style={styles.totalLabel}>Total</Text>
          <View>
            {selectedMethod === 'pix' && (
              <Text style={styles.originalPrice}>
                De: R$ {totalPrice.toFixed(2)}
              </Text>
            )}
            <Text style={[
              styles.totalValue,
              selectedMethod === 'pix' && styles.pixValue
            ]}>
              {selectedMethod === 'pix' 
                ? `R$ ${(totalPrice * 0.95).toFixed(2)}`
                : `R$ ${totalPrice.toFixed(2)}`
              }
            </Text>
          </View>
        </View>

        <Button
          title="Finalizar Compra"
          onPress={handleFinishPurchase}
          variant="primary"
          size="large"
          disabled={!selectedMethod || ((selectedMethod === 'credit' || selectedMethod === 'debit') && !selectedCardId)}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: rem(1),
    backgroundColor: '#141414',
  },
  title: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    marginBottom: rem(1.5),
    color: '#fff',
  },
  methodsList: {
    gap: rem(1),
  },
  methodCard: {
    padding: rem(1.25),
    borderRadius: rem(1),
    minHeight: rem(8),
  },
  selectedMethod: {
    transform: [{ scale: 0.98 }],
  },
  hasCard: {
    borderWidth: 1,
    borderColor: '#fff',
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(1),
  },
  methodContent: {
    gap: rem(0.5),
  },
  methodLabel: {
    fontSize: rem(1.125),
    fontWeight: 'bold',
    color: '#fff',
  },
  methodDescription: {
    fontSize: rem(0.875),
    color: '#fff',
    opacity: 0.8,
  },
  selectedCardInfo: {
    marginTop: rem(0.5),
    gap: rem(0.25),
  },
  cardName: {
    fontSize: rem(0.875),
    color: '#fff',
    fontWeight: '500',
  },
  cardDetails: {
    fontSize: rem(0.875),
    color: '#fff',
    opacity: 0.8,
  },
  changeCard: {
    marginTop: rem(0.5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  changeCardText: {
    fontSize: rem(0.75),
    color: '#fff',
    textDecorationLine: 'underline',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
    marginTop: rem(1),
    opacity: 0.9,
  },
  addCardText: {
    fontSize: rem(0.875),
    color: '#fff',
    fontWeight: '500',
  },
  pixSection: {
    marginTop: rem(1),
  },
  pixContainer: {
    padding: rem(1),
    borderRadius: rem(0.75),
  },
  pixInfo: {
    gap: rem(0.25),
  },
  pixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  pixDiscount: {
    fontSize: rem(1),
    color: '#fff',
    fontWeight: '500',
  },
  pixInstructions: {
    fontSize: rem(0.75),
    color: '#fff',
    opacity: 0.8,
  },
  checkoutSection: {
    marginTop: 'auto',
    paddingTop: rem(2),
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: rem(1.5),
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: rem(1.125),
    color: '#808080',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#fff',
  },
  originalPrice: {
    fontSize: rem(0.875),
    color: '#808080',
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  pixValue: {
    color: '#00875F',
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: rem(1),
  },
});

export const PaymentMethods = memo(PaymentMethodsComponent); 