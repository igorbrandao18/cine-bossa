import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSeatStore, Seat } from '../stores/seatStore';
import { rem } from '@/shared/utils/rem';

interface SeatGridProps {
  seats: Seat[];
}

export function SeatGrid({ seats }: SeatGridProps) {
  const { selectSeat, unselectSeat, selectedSeats } = useSeatStore();

  const handleSeatPress = (seat: Seat) => {
    if (seat.status === 'occupied') return;
    
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      unselectSeat(seat.id);
    } else {
      selectSeat(seat);
    }
  };

  return (
    <View style={styles.container}>
      {/* Implemente a visualização da grade de assentos aqui */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: rem(1),
  },
}); 