import React from 'react';
import { View, ScrollView } from 'react-native';
import { Session, Seat } from '@/features/sessions/types/session';
import { ScreenIndicator } from './ScreenIndicator';
import { SeatRow } from './SeatRow';
import { styles } from './styles/seat-map.styles';

interface SeatMapProps {
  session: Session;
  selectedSeats: Seat[];
  onSeatPress: (seat: Seat) => void;
}

export function SeatMap({ session, selectedSeats, onSeatPress }: SeatMapProps) {
  const rows = Object.entries(
    session.seats.reduce((acc, seat) => {
      const row = seat.row;
      if (!acc[row]) {
        acc[row] = [];
      }
      acc[row].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>)
  ).sort(([a], [b]) => a.localeCompare(b));

  return (
    <View style={styles.container}>
      <ScreenIndicator />
      <ScrollView style={styles.map}>
        {rows.map(([row, seats]) => (
          <SeatRow
            key={row}
            row={row}
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatPress={onSeatPress}
          />
        ))}
      </ScrollView>
    </View>
  );
} 