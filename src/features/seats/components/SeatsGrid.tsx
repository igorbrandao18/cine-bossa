import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { theme, rem } from '@/theme';
import { usePurchaseStore } from '@/features/purchase/stores/purchaseStore';

interface SeatsGridProps {
  sessionId: string;
  onSeatPress: (seat: Seat) => void;
}

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 10;

const generateSeats = (row: string) => {
  return Array.from({ length: SEATS_PER_ROW }, (_, i) => ({
    id: `${row}${i + 1}`,
    row,
    number: i + 1,
    price: 32.00,
    status: Math.random() > 0.8 ? 'occupied' : 'available',
  }));
};

export function SeatsGrid({ sessionId, onSeatPress }: SeatsGridProps) {
  const { selectedSeats } = usePurchaseStore();

  const getSeatStatus = (seatId: string) => {
    if (selectedSeats.some(s => s.id === seatId)) return 'selected';
    const seat = generateSeats(seatId[0]).find(s => s.id === seatId);
    return seat?.status || 'available';
  };

  return (
    <View style={styles.container}>
      {ROWS.map(row => (
        <View key={row} style={styles.row}>
          <Text style={styles.rowLabel}>{row}</Text>
          <View style={styles.seats}>
            {generateSeats(row).map(seat => (
              <TouchableOpacity
                key={seat.id}
                style={[
                  styles.seat,
                  styles[`seat${getSeatStatus(seat.id)}`],
                ]}
                onPress={() => onSeatPress(seat)}
                disabled={seat.status === 'occupied'}
              >
                <Text style={styles.seatNumber}>{seat.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.rowLabel}>{row}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: rem(1),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rem(0.75),
  },
  rowLabel: {
    width: rem(2),
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  seats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: rem(0.5),
  },
  seat: {
    width: rem(2),
    height: rem(2),
    borderRadius: rem(0.25),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  seatavailable: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  seatselected: {
    backgroundColor: theme.colors.primary,
  },
  seatoccupied: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  seatNumber: {
    fontSize: rem(0.75),
    color: theme.colors.text,
  },
}); 