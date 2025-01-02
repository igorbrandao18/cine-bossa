import React, { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';

interface AddCardButtonProps {
  onPress?: () => void;
}

export const AddCardButton = memo(({ onPress }: AddCardButtonProps) => {
  return (
    <Pressable style={styles.addCardButton} onPress={onPress}>
      <MaterialCommunityIcons name="plus" size={rem(1.25)} color="#E50914" />
      <Text style={styles.addCardText}>Adicionar cartão de crédito ou débito</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
    padding: rem(1),
    borderRadius: rem(0.5),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E50914',
  },
  addCardText: {
    color: '#E50914',
    fontSize: rem(1),
    fontWeight: '500',
  },
}); 