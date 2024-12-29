import { theme, Theme, ThemeColors, ThemeSpacing, ThemeTypography } from '../../core/theme/theme';

export const useTheme = () => {
  return {
    ...theme,
    getColor: (color: ThemeColors) => theme.colors[color],
    getSpacing: (spacing: ThemeSpacing) => theme.spacing[spacing],
    getTypography: (typography: ThemeTypography) => theme.typography[typography],
  };
};

export type UseTheme = ReturnType<typeof useTheme>; 