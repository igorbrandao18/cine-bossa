import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '@/core/theme/rem';

interface MovieMetaInfoProps {
  releaseDate: string;
  runtime: number;
  voteCount: number;
}

export function MovieMetaInfo({ releaseDate, runtime, voteCount }: MovieMetaInfoProps) {
  return (
    <View style={styles.metaInfo}>
      <View style={styles.releaseInfo}>
        <Text style={styles.releaseYear}>
          {new Date(releaseDate).getFullYear()}
        </Text>
        <View style={styles.dot} />
        <View style={styles.runtimeContainer}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#ccc" />
          <Text style={styles.runtime}>{runtime}min</Text>
        </View>
        <View style={styles.dot} />
        <Text style={styles.votesCount}>
          {voteCount.toLocaleString()} avaliações
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metaInfo: {
    marginBottom: rem(1),
  },
  releaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: rem(0.375),
  },
  releaseYear: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: rem(0.75),
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  runtimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  runtime: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: rem(0.75),
  },
  votesCount: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: rem(0.75),
  },
}); 