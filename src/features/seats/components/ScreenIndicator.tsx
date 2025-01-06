import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles/screen-indicator.styles';

export function ScreenIndicator() {
  return (
    <LinearGradient
      colors={['#333', '#1A1A1A']}
      style={styles.screen}
    >
      <Text style={styles.screenText}>TELA</Text>
    </LinearGradient>
  );
} 