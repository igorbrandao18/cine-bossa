import { StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { rem } from '../../core/theme/rem';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({ 
  onPress, 
  title, 
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <Text style={[
        styles.text,
        styles[`${variant}Text`],
        disabled && styles.disabledText,
      ]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: rem(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Variants
  primary: {
    backgroundColor: '#E50914',
  },
  secondary: {
    backgroundColor: '#333',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E50914',
  },
  // Sizes
  small: {
    paddingVertical: rem(0.5),
    paddingHorizontal: rem(1),
  },
  medium: {
    paddingVertical: rem(0.75),
    paddingHorizontal: rem(1.5),
  },
  large: {
    paddingVertical: rem(1),
    paddingHorizontal: rem(2),
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  // Text styles
  text: {
    fontSize: rem(1),
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: '#E50914',
  },
  disabledText: {
    opacity: 0.7,
  },
}); 