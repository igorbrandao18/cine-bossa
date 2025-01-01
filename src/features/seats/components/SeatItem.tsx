import React from 'react';
import { Pressable, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Seat } from '@/features/sessions/types/session';
import { styles } from './styles/seat-item.styles';

interface SeatItemProps {
  seat: Seat;
  isSelected: boolean;
  onPress: () => void;
}

export function SeatItem({ seat, isSelected, onPress }: SeatItemProps) {
  const isOccupied = seat.status === 'occupied';

  return (
    <Pressable
      style={[
        styles.seatWrapper,
        isSelected && styles.selectedSeatWrapper,
        isOccupied && styles.occupiedSeatWrapper
      ]}
      onPress={onPress}
      disabled={isOccupied}
    >
      <LinearGradient
        colors={[
          isOccupied ? '#666' :
          isSelected ? '#E50914' : 
          '#333',
          isOccupied ? '#444' :
          isSelected ? '#B71C1C' : 
          '#1A1A1A'
        ]}
        style={styles.seat}
      >
        <Text style={[
          styles.seatNumber,
          isOccupied && styles.occupiedSeatNumber
        ]}>
          {seat.number}
        </Text>
      </LinearGradient>
    </Pressable>
  );
} 