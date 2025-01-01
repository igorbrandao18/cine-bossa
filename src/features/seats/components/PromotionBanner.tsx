import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';

export function PromotionBanner() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="ticket-percent" size={16} color={colors.primary} />
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
    gap: 6,
    backgroundColor: 'rgba(229, 9, 20, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.2)',
  },
  text: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
}); 