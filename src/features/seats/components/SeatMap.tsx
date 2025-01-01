import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';
import type { Seat } from '../types/seat';

interface SeatMapProps {
  seats: Seat[][];
  selectedSeats: string[];
  onSeatPress: (seatId: string) => void;
}

export function SeatMap({ seats, selectedSeats, onSeatPress }: SeatMapProps) {
  return (
    <View style={styles.container}>
      {/* Screen Indicator */}
      <View style={styles.screen}>
        <Text style={styles.screenText}>TELA</Text>
      </View>

      {/* Seats Grid */}
      <View style={styles.grid}>
        {seats.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {/* Row Label */}
            <Text style={styles.rowLabel}>
              {String.fromCharCode(65 + rowIndex)}
            </Text>

            {/* Seats */}
            <View style={styles.seats}>
              {row.map((seat) => (
                <MaterialCommunityIcons
                  key={seat.id}
                  name="seat"
                  size={rem(2)}
                  color={
                    seat.isOccupied 
                      ? '#333' 
                      : selectedSeats.includes(seat.id) 
                        ? '#E50914' 
                        : '#666'
                  }
                  onPress={() => !seat.isOccupied && onSeatPress(seat.id)}
                  style={[
                    styles.seat,
                    seat.isOccupied && styles.seatDisabled
                  ]}
                />
              ))}
            </View>

            {/* Row Label (right side) */}
            <Text style={styles.rowLabel}>
              {String.fromCharCode(65 + rowIndex)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: rem(2),
  },
  screen: {
    width: '80%',
    height: rem(3),
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: rem(3),
    transform: [{ perspective: 500 }, { rotateX: '-30deg' }],
  },
  screenText: {
    color: '#666',
    fontSize: rem(0.875),
    fontWeight: 'bold',
  },
  grid: {
    gap: rem(0.75),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  rowLabel: {
    width: rem(1.5),
    color: '#666',
    fontSize: rem(0.875),
    textAlign: 'center',
  },
  seats: {
    flexDirection: 'row',
    gap: rem(0.5),
  },
  seat: {
    opacity: 1,
  },
  seatDisabled: {
    opacity: 0.5,
  },
}); 