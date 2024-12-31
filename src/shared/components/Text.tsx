import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '@/core/theme';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
}

export function Text({ variant = 'body', style, ...props }: TextProps) {
  return (
    <RNText 
      style={[
        styles.base,
        variant && theme.typography[variant],
        { color: theme.colors.text },
        style
      ]} 
      {...props} 
    />
  );
}

const styles = StyleSheet.create({
  base: {
    color: '#FFFFFF',
  },
}); 