import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';

interface SavedCardProps {
  card: {
    id: string;
    last4: string;
    brand: string;
    name: string;
    expiryDate: string;
  };
  selected: boolean;
  onPress: () => void;
}

const SavedCardComponent = ({ card, selected, onPress }: SavedCardProps) => {
  return (
    <Pressable
      style={[styles.savedCard, selected && styles.selectedCard]}
      onPress={onPress}
    >
      <View style={styles.cardInfo}>
        <MaterialCommunityIcons
          name={`${card.brand}-card` as any}
          size={rem(1.5)}
          color="#999"
        />
        <View style={styles.cardTextInfo}>
          <Text style={styles.cardNumber}>•••• {card.last4}</Text>
          <Text style={styles.cardExpiry}>Expira em {card.expiryDate}</Text>
        </View>
      </View>
      <View style={[styles.radioOuter, selected && styles.selectedRadioOuter]}>
        <View style={[styles.radioInner, selected && styles.selectedRadioInner]} />
      </View>
    </Pressable>
  );
};

export const SavedCard = memo(SavedCardComponent);

const styles = StyleSheet.create({
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rem(1),
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.5),
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedCard: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    borderColor: '#E50914',
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
  radioOuter: {
    width: rem(1.25),
    height: rem(1.25),
    borderRadius: rem(0.625),
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioOuter: {
    borderColor: '#E50914',
  },
  radioInner: {
    width: rem(0.625),
    height: rem(0.625),
    borderRadius: rem(0.3125),
    backgroundColor: 'transparent',
  },
  selectedRadioInner: {
    backgroundColor: '#E50914',
  },
}); 