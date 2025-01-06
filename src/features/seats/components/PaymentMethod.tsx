import React, { memo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';

interface PaymentMethodProps {
  method: {
    id: string;
    label: string;
    icon: string;
    description: string;
    selectedCard?: {
      last4: string;
      brand: string;
      name: string;
      expiryDate: string;
    };
  };
  selected: boolean;
  onPress: () => void;
  selectedCardId?: string | null;
}

function PaymentMethodComponent({ method, selected, onPress, selectedCardId }: PaymentMethodProps) {
  const showSelectedCard = selectedCardId && 
    (method.id === 'credit' || method.id === 'debit') && 
    method.selectedCard;

  const selectedCard = method.selectedCard;

  return (
    <Pressable 
      style={[
        styles.container, 
        selected && styles.selected,
        showSelectedCard && styles.hasCard
      ]} 
      onPress={onPress}
    >
      <View style={styles.content}>
        <MaterialCommunityIcons 
          name={showSelectedCard ? 'credit-card-check' : method.icon as any} 
          size={rem(1.5)} 
          color={selected ? '#fff' : showSelectedCard ? '#E50914' : '#999'} 
        />
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && styles.selectedText]}>
            {method.label}
          </Text>
          {showSelectedCard && selectedCard ? (
            <View style={styles.cardPreview}>
              <Text style={[styles.cardInfo, selected && styles.selectedText]}>
                {selectedCard.name}
              </Text>
              <Text style={[styles.cardNumber, selected && styles.selectedText]}>
                •••• {selectedCard.last4} ({selectedCard.brand.toUpperCase()})
              </Text>
            </View>
          ) : (
            <Text style={[styles.description, selected && styles.selectedText]}>
              {method.description}
            </Text>
          )}
        </View>
      </View>
      {selected && (
        <MaterialCommunityIcons 
          name="check-circle" 
          size={rem(1.25)} 
          color="#E50914" 
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rem(1),
    borderRadius: rem(0.5),
    backgroundColor: '#2F2F2F',
    borderWidth: 1,
    borderColor: '#404040',
  },
  selected: {
    backgroundColor: '#141414',
    borderColor: '#E50914',
    transform: [{ scale: 0.98 }],
  },
  hasCard: {
    borderColor: '#E50914',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  textContainer: {
    gap: rem(0.25),
  },
  label: {
    fontSize: rem(1),
    color: '#fff',
    fontWeight: '500',
  },
  description: {
    fontSize: rem(0.875),
    color: '#808080',
  },
  cardPreview: {
    gap: rem(0.125),
  },
  cardInfo: {
    fontSize: rem(0.875),
    color: '#E50914',
    fontWeight: '500',
  },
  cardNumber: {
    fontSize: rem(0.875),
    color: '#E50914',
    fontWeight: '500',
    letterSpacing: rem(0.1),
  },
  selectedText: {
    color: '#fff',
  },
});

export const PaymentMethod = memo(PaymentMethodComponent); 