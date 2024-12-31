import { PixelRatio } from 'react-native';

export const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16);

export const theme = {
  colors: {
    primary: '#E50914',
    background: '#000000',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#333333',
    error: '#FF453A',
    success: '#32D74B',
  },
  spacing: {
    xs: rem(0.25),
    sm: rem(0.5),
    md: rem(1),
    lg: rem(1.5),
    xl: rem(2),
    xxl: rem(3),
  },
  typography: {
    h1: { fontSize: rem(2), lineHeight: rem(2.5), fontWeight: '700' },
    h2: { fontSize: rem(1.75), lineHeight: rem(2.25), fontWeight: '700' },
    h3: { fontSize: rem(1.5), lineHeight: rem(2), fontWeight: '600' },
    body: { fontSize: rem(1), lineHeight: rem(1.5), fontWeight: '400' },
    caption: { fontSize: rem(0.875), lineHeight: rem(1.25), fontWeight: '400' },
  }
}; 