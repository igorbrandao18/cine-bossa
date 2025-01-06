import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '@/core/theme/rem';

interface MovieOverviewProps {
  overview: string;
  onBuyTicket: () => void;
}

export function MovieOverview({ overview, onBuyTicket }: MovieOverviewProps) {
  return (
    <View style={styles.movieContent}>
      <Paragraph style={styles.overview}>{overview}</Paragraph>

      <Button 
        mode="contained" 
        onPress={onBuyTicket}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        icon={({ size, color }) => (
          <MaterialCommunityIcons name="ticket" size={24} color={color} />
        )}
      >
        Comprar Ingresso
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  movieContent: {
    padding: rem(1.25),
    paddingTop: rem(0.75),
    backgroundColor: '#000',
  },
  overview: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: rem(0.875),
    lineHeight: rem(1.375),
    marginBottom: rem(1.5),
  },
  button: {
    backgroundColor: '#E50914',
    borderRadius: rem(0.375),
  },
  buttonContent: {
    height: rem(3),
  },
  buttonLabel: {
    fontSize: rem(1),
    fontWeight: '600',
    letterSpacing: 0.3,
  },
}); 