import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { rem } from '../../../core/theme/rem';

interface AddCardButtonProps {
  onPress?: () => void;
}

export const AddCardButton = memo(({ onPress }: AddCardButtonProps) => {
  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/payment/add-card"
      });
    }
  }, [onPress]);

  return (
    <Pressable 
      style={styles.addCardButton} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(229, 9, 20, 0.1)' }}
    >
      <MaterialCommunityIcons name="plus-circle-outline" size={rem(1.5)} color="#666" />
      <Text style={styles.addCardText}>Adicionar novo cartão</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
    padding: rem(1.25),
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  addCardText: {
    color: '#666',
    fontSize: rem(1),
    fontWeight: '500',
  },
}); 