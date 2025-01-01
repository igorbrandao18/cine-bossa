import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';
import type { Seat } from '../types/seat';

interface SeatsGridProps {
  seats: Seat[][];
  selectedSeats: string[];
  onSeatPress: (seatId: string) => void;
}

export function SeatsGrid({ seats, selectedSeats, onSeatPress }: SeatsGridProps) {
  const getSeatColor = (seat: Seat) => {
    if (seat.isOccupied) return '#333';
    if (selectedSeats.includes(seat.id)) return '#E50914';
    return '#666';
  };

  return (
    <View style={styles.container}>
      {seats.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((seat) => (
            <MaterialCommunityIcons
              key={seat.id}
              name="seat"
              size={rem(2)}
              color={getSeatColor(seat)}
              onPress={() => !seat.isOccupied && onSeatPress(seat.id)}
              style={[
                styles.seat,
                seat.isOccupied && styles.seatDisabled
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: rem(1),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: rem(0.5),
    marginBottom: rem(0.5),
  },
  seat: {
    opacity: 1,
  },
  seatDisabled: {
    opacity: 0.5,
  },
}); 