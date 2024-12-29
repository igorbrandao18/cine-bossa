import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Skeleton } from './Skeleton';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.4;

export const FeaturedMovieSkeleton = () => {
  return (
    <View style={styles.container}>
      <Skeleton width="100%" height="100%" borderRadius={0} />
      <View style={styles.content}>
        <Skeleton width={200} height={24} />
        <View style={styles.gap} />
        <Skeleton width={width - 64} height={16} />
        <View style={styles.gap} />
        <Skeleton width={120} height={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: BANNER_HEIGHT,
    width,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  gap: {
    height: 12,
  }
}); 