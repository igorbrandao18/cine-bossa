import React from 'react';
import { View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { Session } from '@/features/sessions/types/session';
import { styles } from './styles/seats-header.styles';

interface SeatsHeaderProps {
  currentSession: Session;
  onBack: () => void;
}

export function SeatsHeader({ currentSession, onBack }: SeatsHeaderProps) {
  return (
    <View style={styles.header}>
      <IconButton
        icon="chevron-left"
        iconColor="#fff"
        size={24}
        onPress={onBack}
        style={styles.backButton}
      />
      <View style={styles.headerInfo}>
        <Text style={styles.movieTitle}>{currentSession.movieTitle}</Text>
        <Text style={styles.sessionInfo}>
          {currentSession.room} - {currentSession.technology} • {currentSession.time}
        </Text>
      </View>
    </View>
  );
} 