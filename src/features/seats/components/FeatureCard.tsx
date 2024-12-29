import React from 'react';
import { Pressable, StyleSheet, Vibration, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import { ROOM_FEATURES } from '../types/seats';

interface FeatureCardProps {
  feature: typeof ROOM_FEATURES[keyof typeof ROOM_FEATURES];
  index: number;
}

export const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  // ... seu código atual do FeatureCard ...
};

const styles = StyleSheet.create({
  // ... seus estilos relacionados ao FeatureCard ...
}); 