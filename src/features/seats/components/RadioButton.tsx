import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { rem } from '../../../core/theme/rem';

interface RadioButtonProps {
  selected: boolean;
}

export const RadioButton = memo(({ selected }: RadioButtonProps) => (
  <View style={[styles.radioOuter, selected && styles.selectedRadioOuter]}>
    <View style={[styles.radioInner, selected && styles.selectedRadioInner]} />
  </View>
));

const styles = StyleSheet.create({
  radioOuter: {
    width: rem(1.25),
    height: rem(1.25),
    borderRadius: rem(0.625),
    borderWidth: 2,
    borderColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioOuter: {
    borderColor: '#E50914',
  },
  radioInner: {
    width: rem(0.625),
    height: rem(0.625),
    borderRadius: rem(0.3125),
    backgroundColor: 'transparent',
  },
  selectedRadioInner: {
    backgroundColor: '#E50914',
  },
}); 