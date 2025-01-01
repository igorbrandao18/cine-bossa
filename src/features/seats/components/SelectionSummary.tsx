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
          selectedSeats.length === 0 && styles.disabledButton
        ]}
        onPress={onContinue}
        disabled={selectedSeats.length === 0}
      >
        <Text style={styles.continueText}>AVANÇAR</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
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
    marginBottom: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 12,
    borderRadius: 8,
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
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#666',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
}); 