import React from 'react';
import { View, StyleSheet, Vibration } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withSequence
} from 'react-native-reanimated';
import { Seat, SEAT_TYPES } from '../types/seats';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SeatProps {
  seat: Seat;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
}

const getSeatIcon = (type: Seat['type']) => {
  switch (type) {
    case 'd-box':
      return 'seat-recline-extra';
    case 'imax':
      return 'theater';
    case 'vip':
      return 'seat-legroom-extra';
    case 'couple':
      return 'sofa';
    default:
      return 'seat';
  }
};

export const SeatComponent = React.memo(({ 
  seat, 
  onPress, 
  disabled = false,
  selected = false 
}: SeatProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handlePress = () => {
    if (disabled) return;

    Vibration.vibrate(50);
    scale.value = withSequence(
      withSpring(0.8, { duration: 100 }),
      withSpring(1, { duration: 100 })
    );
    onPress();
  };

  const getBackgroundColor = () => {
    if (disabled) return '#666';
    if (selected) return '#E50914';
    return SEAT_TYPES[seat.type].color;
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <IconButton
        icon={getSeatIcon(seat.type)}
        size={28}
        onPress={handlePress}
        disabled={disabled}
        iconColor={disabled ? '#999' : '#000'}
        style={[
          styles.seat,
          { backgroundColor: getBackgroundColor() }
        ]}
      />
      <Text style={styles.label}>{`${seat.row}${seat.number.toString().padStart(2, '0')}`}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 4,
  },
  seat: {
    margin: 0,
    backgroundColor: '#333',
    borderRadius: 8,
    width: 44,
    height: 44,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontFamily: 'monospace',
  }
}); 