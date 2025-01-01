import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function PromotionBanner() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="ticket-percent" size={20} color="#E50914" />
      <Text style={styles.text}>
        Super Segunda: 25% em todos os assentos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E50914',
  },
  text: {
    color: '#E50914',
    fontSize: 14,
    fontWeight: '500',
  },
}); 