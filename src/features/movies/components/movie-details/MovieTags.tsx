import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '@/core/theme/rem';
import { Genre } from '@/core/types/tmdb';

interface MovieTagsProps {
  genres: Genre[];
  isAdult: boolean;
}

export function MovieTags({ genres, isAdult }: MovieTagsProps) {
  return (
    <View style={styles.tagsContainer}>
      <View style={styles.qualityTags}>
        <Chip 
          style={[styles.chip, styles.qualityChip]} 
          textStyle={styles.qualityChipText}
          icon={() => (
            <MaterialCommunityIcons name="quality-high" size={12} color="rgba(255, 255, 255, 0.9)" />
          )}
        >
          4K Ultra HD
        </Chip>
        <Chip 
          style={[styles.chip, styles.qualityChip]} 
          textStyle={styles.qualityChipText}
          icon={() => (
            <MaterialCommunityIcons name="surround-sound" size={12} color="rgba(255, 255, 255, 0.9)" />
          )}
        >
          Dolby Atmos
        </Chip>
        {isAdult && (
          <Chip 
            style={[styles.chip, styles.adultChip]} 
            textStyle={styles.adultChipText}
            icon={() => (
              <MaterialCommunityIcons name="alert-circle" size={12} color="#E50914" />
            )}
          >
            18+
          </Chip>
        )}
      </View>

      <View style={styles.genreContainer}>
        {genres.map(genre => (
          <Chip 
            key={genre.id} 
            style={[styles.chip, styles.genreChip]}
            textStyle={styles.genreText}
            icon={() => (
              <MaterialCommunityIcons 
                name="tag" 
                size={12} 
                color="#E50914" 
                style={{ transform: [{ rotate: '90deg' }] }}
              />
            )}
          >
            {genre.name}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    gap: rem(0.625),
  },
  qualityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.5),
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.5),
  },
  chip: {
    height: rem(1.625),
    borderRadius: rem(0.25),
    paddingHorizontal: rem(0.5),
  },
  qualityChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  qualityChipText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: rem(0.625),
    fontWeight: '500',
    letterSpacing: 0.2,
    marginLeft: rem(0.25),
  },
  adultChip: {
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.2)',
  },
  adultChipText: {
    color: '#E50914',
    fontSize: rem(0.625),
    fontWeight: '600',
    letterSpacing: 0.2,
    marginLeft: rem(0.25),
  },
  genreChip: {
    backgroundColor: 'rgba(229, 9, 20, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.15)',
  },
  genreText: {
    color: '#E50914',
    fontSize: rem(0.625),
    fontWeight: '500',
    letterSpacing: 0.2,
    marginLeft: rem(0.25),
  },
}); 