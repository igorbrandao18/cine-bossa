import React from 'react';
import { View, Text } from 'react-native';
import { Seat } from '@/features/sessions/types/session';
import { SeatItem } from './SeatItem';
import { styles } from './styles/seat-row.styles';

interface SeatRowProps {
  row: string;
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatPress: (seat: Seat) => void;
}

export function SeatRow({ row, seats, selectedSeats, onSeatPress }: SeatRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{row}</Text>
      <View style={styles.seats}>
        {seats.map((seat) => (
          <SeatItem
            key={seat.id}
            seat={seat}
            isSelected={selectedSeats.some((s) => s.id === seat.id)}
            onPress={() => onSeatPress(seat)}
          />
        ))}
      </View>
    </View>
  );
} 