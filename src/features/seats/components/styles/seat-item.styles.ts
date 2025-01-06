import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

export const styles = StyleSheet.create({
  seatWrapper: {
    width: 32,
    height: 32,
    margin: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  selectedSeatWrapper: {
    transform: [{ scale: 1.1 }],
  },
  occupiedSeatWrapper: {
    opacity: 0.5,
  },
  seat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNumber: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  occupiedSeatNumber: {
    color: colors.textMuted,
  },
}); 