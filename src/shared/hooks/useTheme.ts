import { theme, Theme, ThemeColors, ThemeSpacing, ThemeTypography, ThemeBorderRadius, ThemeShadows, ThemeGlass } from '../../core/theme/theme';

export function useTheme() {
  return {
    ...theme,
    getColor: (color: ThemeColors) => theme.colors[color],
    getSpacing: (spacing: ThemeSpacing) => theme.spacing[spacing],
    getTypography: (typography: ThemeTypography) => theme.typography[typography],
    getBorderRadius: (borderRadius: ThemeBorderRadius) => theme.borderRadius[borderRadius],
    getShadow: (shadow: ThemeShadows) => theme.shadows[shadow],
    getGlass: (glass: ThemeGlass) => theme.glass[glass],
  };
}

export type UseTheme = ReturnType<typeof useTheme>; 