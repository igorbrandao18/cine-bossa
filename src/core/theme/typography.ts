import { rem } from './spacing';

export const typography = {
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
  body: {
    fontSize: rem(1),      // 16px
    lineHeight: rem(1.5),  // 24px
    fontWeight: '400',
  },
  caption: {
    fontSize: rem(0.875),  // 14px
    lineHeight: rem(1.25), // 20px
    fontWeight: '400',
  },
} as const;

export type ThemeTypography = keyof typeof typography; 