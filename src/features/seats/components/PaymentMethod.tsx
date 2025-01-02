import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';

interface PaymentMethodProps {
  method: {
    id: string;
    label: string;
    icon: string;
    description?: string;
  };
  selected: boolean;
  onPress: () => void;
}

export const PaymentMethod = memo(({ method, selected, onPress }: PaymentMethodProps) => (
  <Pressable
    style={[styles.container, selected && styles.selectedContainer]}
    onPress={onPress}
  >
    <View style={styles.leftContent}>
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        <MaterialCommunityIcons
          name={method.icon as any}
          size={rem(1.75)}
          color={selected ? '#fff' : '#999'}
        />
      </View>
      <View style={styles.textContent}>
        <Text style={[styles.methodLabel, selected && styles.selectedMethodLabel]}>
          {method.label}
        </Text>
        {method.description && (
          <Text style={[styles.methodDescription, selected && styles.selectedMethodDescription]}>
            {method.description}
          </Text>
        )}
      </View>
    </View>

    <View style={[styles.selectionIndicator, selected && styles.selectedIndicator]}>
      <MaterialCommunityIcons
        name={selected ? "check-circle" : "circle-outline"}
        size={rem(1.5)}
        color={selected ? "#E50914" : "#666"}
      />
    </View>
  </Pressable>
));

const styles = StyleSheet.create({
  container: {
    height: rem(5.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: rem(1.25),
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: rem(0.75),
  },
  selectedContainer: {
    backgroundColor: '#000',
    borderColor: '#E50914',
    transform: [{ scale: 0.98 }],
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1.25),
  },
  iconContainer: {
    width: rem(3.5),
    height: rem(3.5),
    borderRadius: rem(1.75),
    backgroundColor: '#262626',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedIconContainer: {
    backgroundColor: '#E50914',
    borderColor: '#E50914',
  },
  textContent: {
    gap: rem(0.25),
  },
  methodLabel: {
    fontSize: rem(1.125),
    fontWeight: '600',
    color: '#999',
  },
  selectedMethodLabel: {
    color: '#fff',
  },
  methodDescription: {
    fontSize: rem(0.875),
    color: '#666',
  },
  selectedMethodDescription: {
    color: '#999',
  },
  selectionIndicator: {
    width: rem(1.5),
    height: rem(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    transform: [{ scale: 1.1 }],
  },
}); 