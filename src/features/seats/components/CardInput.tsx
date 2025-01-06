import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getCardBrand, formatCardNumber, validateCardNumber } from '../utils/cardUtils';
import { rem } from '../../../core/theme/rem';

interface CardInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const CardInput = React.memo(({ value, onChangeText, error }: CardInputProps) => {
  const [focused, setFocused] = useState(false);
  const brand = getCardBrand(value);
  const isValid = value.length > 13 && validateCardNumber(value);

  const handleChangeText = useCallback((text: string) => {
    const formatted = formatCardNumber(text);
    onChangeText(formatted);
  }, [onChangeText]);

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputContainer,
        focused && styles.focusedContainer,
        error && styles.errorContainer,
        isValid && styles.validContainer
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Número do cartão"
          placeholderTextColor="#666"
          keyboardType="numeric"
          maxLength={19}
        />
        
        {brand ? (
          <MaterialCommunityIcons
            name={`${brand}-card`}
            size={rem(1.5)}
            color={isValid ? '#E50914' : '#666'}
            style={styles.brandIcon}
          />
        ) : value.length > 0 && (
          <MaterialCommunityIcons
            name="credit-card-outline"
            size={rem(1.5)}
            color="#666"
            style={styles.brandIcon}
          />
        )}
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: rem(0.5),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.5),
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: rem(1),
    height: rem(3.5),
  },
  focusedContainer: {
    borderColor: '#666',
  },
  errorContainer: {
    borderColor: '#E50914',
  },
  validContainer: {
    borderColor: '#E50914',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: rem(1),
    fontFamily: 'monospace',
    letterSpacing: rem(0.1),
  },
  brandIcon: {
    marginLeft: rem(0.5),
  },
  errorText: {
    color: '#E50914',
    fontSize: rem(0.75),
  },
}); 