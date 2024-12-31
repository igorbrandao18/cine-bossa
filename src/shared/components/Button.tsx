import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { Text } from './Text';
import { theme } from '@/core/theme';
import { rem } from '@/core/theme';

interface ButtonProps extends TouchableOpacityProps {
  mode?: 'contained' | 'outlined';
  children: string;
}

export function Button({ 
  mode = 'contained', 
  children, 
  style, 
  disabled,
  ...props 
}: ButtonProps) {
  const buttonStyles = [
    styles.base,
    mode === 'contained' && {
      backgroundColor: disabled ? theme.colors.surfaceVariant : theme.colors.primary
    },
    mode === 'outlined' && {
      borderWidth: 1,
      borderColor: theme.colors.primary
    },
    disabled && styles.disabled,
    style
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles}
      disabled={disabled}
      {...props}
    >
      <Text 
        style={[
          styles.text,
          mode === 'outlined' && { color: theme.colors.primary }
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: rem(3),
    paddingHorizontal: rem(1.25),
    borderRadius: rem(0.75),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: rem(1),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.5,
  },
}); 