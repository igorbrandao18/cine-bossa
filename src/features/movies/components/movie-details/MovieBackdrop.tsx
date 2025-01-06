import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG, SIZES } from '@/core/config/api';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.7;

interface MovieBackdropProps {
  backdropPath: string;
}

export function MovieBackdrop({ backdropPath }: MovieBackdropProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ 
          uri: `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.original}${backdropPath}` 
        }}
        style={styles.backdrop}
        contentFit="cover"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(0,0,0,0.8)', '#000']}
        style={styles.gradient}
        locations={[0, 0.2, 0.6, 0.9]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    position: 'relative',
  },
  backdrop: {
    width: width,
    height: HEADER_HEIGHT,
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_HEIGHT,
  },
}); 