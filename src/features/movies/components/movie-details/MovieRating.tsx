import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '@/core/theme/rem';

interface MovieRatingProps {
  voteAverage: number;
  matchScore?: number;
}

export function MovieRating({ voteAverage, matchScore = 98 }: MovieRatingProps) {
  return (
    <View style={styles.mainInfo}>
      <View style={styles.ratingBox}>
        <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
        <Text style={styles.ratingValue}>
          {voteAverage.toFixed(1)}
        </Text>
        <Text style={styles.ratingTotal}>/10</Text>
      </View>

      <View style={styles.matchScore}>
        <MaterialCommunityIcons name="thumb-up" size={18} color="#E50914" />
        <Text style={styles.matchText}>{matchScore}% relevante</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
    marginBottom: rem(0.75),
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: rem(0.5),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.375),
  },
  ratingValue: {
    color: '#FFD700',
    fontSize: rem(0.875),
    fontWeight: 'bold',
  },
  ratingTotal: {
    color: 'rgba(255, 215, 0, 0.7)',
    fontSize: rem(0.75),
  },
  matchScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.375),
    backgroundColor: 'rgba(229, 9, 20, 0.15)',
    paddingHorizontal: rem(0.5),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.375),
  },
  matchText: {
    color: '#E50914',
    fontSize: rem(0.875),
    fontWeight: '600',
  },
}); 