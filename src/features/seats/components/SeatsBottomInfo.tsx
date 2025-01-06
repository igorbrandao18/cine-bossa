import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PromotionBanner } from './PromotionBanner';
import { SelectionSummary } from './SelectionSummary';

interface SeatsBottomInfoProps {
  selectedSeats: string[];
  totalPrice: number;
  onContinue: () => void;
}

export function SeatsBottomInfo({ selectedSeats, totalPrice, onContinue }: SeatsBottomInfoProps) {
  return (
    <View style={styles.bottomContainer}>
      <PromotionBanner />
      <SelectionSummary 
        selectedSeats={selectedSeats}
        totalPrice={totalPrice}
        onContinue={onContinue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    gap: 24,
  },
}); 