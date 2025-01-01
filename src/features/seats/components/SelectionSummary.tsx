import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'react-native-linear-gradient';
import { colors } from '@/core/theme/colors';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';

interface SelectionSummaryProps {
  selectedSeats: string[];
  onContinue: () => void;
}

export function SelectionSummary({ selectedSeats, onContinue }: SelectionSummaryProps) {
  const { currentSession } = useSessionStore();

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = currentSession?.seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const getSelectedSeatsInfo = () => {
    return selectedSeats.map(seatId => {
      const seat = currentSession?.seats.find(s => s.id === seatId);
      return seat ? `${seat.row}${seat.number}` : '';
    }).join(', ');
  };

  return (
    <View style={styles.container}>
      <View style={styles.priceInfo}>
        <View>
          <Text style={styles.selectedCount}>
            {selectedSeats.length} {selectedSeats.length === 1 ? 'assento' : 'assentos'} selecionado{selectedSeats.length !== 1 ? 's' : ''}
          </Text>
          {selectedSeats.length > 0 && (
            <Text style={styles.seatsDetail}>
              Assentos: {getSelectedSeatsInfo()}
            </Text>
          )}
        </View>
        <Text style={styles.totalPrice}>
          R$ {getTotalPrice().toFixed(2)}
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          selectedSeats.length === 0 && styles.disabledButton,
          pressed && styles.buttonPressed
        ]}
        onPress={onContinue}
        disabled={selectedSeats.length === 0}
      >
        <LinearGradient
          colors={colors.gradients.button}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.continueText}>FINALIZAR SELEÇÃO</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
        </LinearGradient>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: colors.overlay.dark,
    padding: 12,
    borderRadius: 8,
  },
  selectedCount: {
    color: colors.text,
    fontSize: 14,
  },
  seatsDetail: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  totalPrice: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  continueButton: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  disabledButton: {
    opacity: 0.5,
  },
  continueText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
}); 