import { View, StyleSheet, Pressable } from 'react-native';
import { rem } from '../../core/theme/rem';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'filled';
  style?: any;
}

export function Card({ 
  children, 
  onPress, 
  variant = 'elevated',
  style,
}: CardProps) {
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper
      style={[
        styles.container,
        styles[variant],
        style,
      ]}
      onPress={onPress}
      android_ripple={onPress && { color: 'rgba(255, 255, 255, 0.1)' }}
    >
      {children}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: rem(0.75),
    overflow: 'hidden',
  },
  elevated: {
    backgroundColor: '#1a1a1a',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: rem(0.125), // 2px
    },
    shadowOpacity: 0.25,
    shadowRadius: rem(0.5),
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
  filled: {
    backgroundColor: '#1a1a1a',
  },
}); 