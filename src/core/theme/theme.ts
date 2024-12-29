import { colors } from './colors';
import { spacing, rem } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius: {
    sm: rem(0.25),  // 4px
    md: rem(0.5),   // 8px
    lg: rem(0.75),  // 12px
    xl: rem(1),     // 16px
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.32,
      shadowRadius: 5.46,
      elevation: 9,
    },
  },
  glass: {
    light: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
    },
    dark: {
      backgroundColor: 'rgba(28, 28, 30, 0.6)',
      backdropFilter: 'blur(10px)',
    },
  },
} as const;

export type Theme = typeof theme;
export { rem };
export * from './colors';
export * from './spacing';
export * from './typography'; 