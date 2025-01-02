import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RadioButton } from './RadioButton';
import { rem } from '../../../core/theme/rem';

interface PaymentMethodProps {
  method: {
    id: string;
    label: string;
    icon: string;
  };
  selected: boolean;
  onPress: () => void;
}

export const PaymentMethod = memo(({ method, selected, onPress }: PaymentMethodProps) => (
  <Pressable
    style={[styles.methodCard, selected && styles.selectedCard]}
    onPress={onPress}
  >
    <View style={styles.methodContent}>
      <MaterialCommunityIcons
        name={method.icon as any}
        size={rem(1.5)}
        color={selected ? '#E50914' : '#999'}
        style={styles.methodIcon}
      />
      <Text style={[styles.methodLabel, selected && styles.selectedMethodLabel]}>
        {method.label}
      </Text>
    </View>
    <RadioButton selected={selected} />
  </Pressable>
));

const styles = StyleSheet.create({
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: rem(0.75),
    paddingHorizontal: rem(0.5),
    borderRadius: rem(0.25),
  },
  selectedCard: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  methodIcon: {
    width: rem(1.5),
  },
  methodLabel: {
    fontSize: rem(1),
    color: '#999',
  },
  selectedMethodLabel: {
    color: '#fff',
    fontWeight: '500',
  },
}); 