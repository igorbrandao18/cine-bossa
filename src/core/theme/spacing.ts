import { PixelRatio } from 'react-native';

export const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16);

export const spacing = {
  xs: rem(0.25),  // 4px
  sm: rem(0.5),   // 8px
  md: rem(1),     // 16px
  lg: rem(1.5),   // 24px
  xl: rem(2),     // 32px
  xxl: rem(3),    // 48px
} as const;

export type ThemeSpacing = keyof typeof spacing; 