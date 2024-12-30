import { PixelRatio } from 'react-native';

const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16);

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
    warning: '#FF9F0A',
  },
  spacing: {
    xs: rem(0.25), // 4px
    sm: rem(0.5),  // 8px
    md: rem(1),    // 16px
    lg: rem(1.5),  // 24px
    xl: rem(2),    // 32px
    xxl: rem(3),   // 48px
  },
  typography: {
    h1: {
      fontSize: rem(2),      // 32px
      lineHeight: rem(2.5),  // 40px
      fontWeight: '700',
    },
    h2: {
      fontSize: rem(1.75),   // 28px
      lineHeight: rem(2.25), // 36px
      fontWeight: '700',
    },
    h3: {
      fontSize: rem(1.5),    // 24px
      lineHeight: rem(2),    // 32px
      fontWeight: '600',
    },
    h4: {
      fontSize: rem(1.25),   // 20px
      lineHeight: rem(1.75), // 28px
      fontWeight: '600',
    },
    body: {
      fontSize: rem(1),      // 16px
      lineHeight: rem(1.5),  // 24px
      fontWeight: '400',
    },
    bodySmall: {
      fontSize: rem(0.875),  // 14px
      lineHeight: rem(1.25), // 20px
      fontWeight: '400',
    },
    caption: {
      fontSize: rem(0.75),   // 12px
      lineHeight: rem(1),    // 16px
      fontWeight: '400',
    },
    button: {
      fontSize: rem(1),      // 16px
      lineHeight: rem(1.5),  // 24px
      fontWeight: '500',
    },
  },
  borderRadius: {
    xs: rem(0.25),  // 4px
    sm: rem(0.5),   // 8px
    md: rem(0.75),  // 12px
    lg: rem(1),     // 16px
    xl: rem(1.5),   // 24px
    xxl: rem(2),    // 32px
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
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
export type ThemeColors = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeTypography = keyof typeof theme.typography;
export type ThemeBorderRadius = keyof typeof theme.borderRadius;
export type ThemeShadows = keyof typeof theme.shadows;
export type ThemeGlass = keyof typeof theme.glass; 