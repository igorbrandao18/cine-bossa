import React, { memo } from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import { Text } from 'react-native-paper';
import { rem } from '../../../core/theme/rem';

const BRAND_LOGOS = {
  visa: 'https://logodownload.org/wp-content/uploads/2016/10/visa-logo-1.png',
  mastercard: 'https://logodownload.org/wp-content/uploads/2014/07/mastercard-logo-7.png',
  amex: 'https://logodownload.org/wp-content/uploads/2014/07/american-express-logo-4.png',
  elo: 'https://logodownload.org/wp-content/uploads/2017/04/elo-logo-0.png',
  hipercard: 'https://logodownload.org/wp-content/uploads/2017/04/hipercard-logo-0.png',
  diners: 'https://logodownload.org/wp-content/uploads/2014/07/diners-club-logo-0.png'
} as const;

interface SavedCardProps {
  card: {
    id: string;
    last4: string;
    brand: keyof typeof BRAND_LOGOS;
    name: string;
    expiryDate: string;
  };
  selected: boolean;
  onPress: () => void;
}

export const SavedCard = memo(({ card, selected, onPress }: SavedCardProps) => {
  return (
    <Pressable
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={onPress}
    >
      <View style={styles.leftContent}>
        <View style={styles.brandContainer}>
          <Image
            source={{ uri: BRAND_LOGOS[card.brand] }}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardNumber}>•••• {card.last4}</Text>
          <Text style={styles.expiryDate}>Expira em {card.expiryDate}</Text>
        </View>
      </View>

      <View style={[styles.radioOuter, selected && styles.selectedRadioOuter]}>
        <View style={[styles.radioInner, selected && styles.selectedRadioInner]} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rem(1),
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: rem(0.75),
  },
  selectedContainer: {
    backgroundColor: '#000',
    borderColor: '#E50914',
    transform: [{ scale: 0.98 }],
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  brandContainer: {
    width: rem(3.5),
    height: rem(2),
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    gap: rem(0.25),
  },
  cardNumber: {
    fontSize: rem(1),
    color: '#fff',
    fontWeight: '500',
  },
  expiryDate: {
    fontSize: rem(0.75),
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