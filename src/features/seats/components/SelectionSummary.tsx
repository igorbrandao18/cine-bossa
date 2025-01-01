import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SelectionSummaryProps {
  selectedSeats: string[];
  totalPrice: number;
  onContinue: () => void;
}

export function SelectionSummary({ selectedSeats, totalPrice, onContinue }: SelectionSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.priceInfo}>
        <Text style={styles.selectedCount}>
          {selectedSeats.length} {selectedSeats.length === 1 ? 'assento' : 'assentos'} selecionado{selectedSeats.length !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.totalPrice}>
          R$ {totalPrice.toFixed(2)}
        </Text>
      </View>

      <Pressable
        style={[
          styles.continueButton,
          selectedSeats.length === 0 && { opacity: 0.5 }
        ]}
        onPress={onContinue}
        disabled={selectedSeats.length === 0}
      >
        <Text style={styles.continueText}>Continuar</Text>
        <MaterialCommunityIcons name="chevron-right" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  priceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedCount: {
    color: '#fff',
    fontSize: 14,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E50914',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 