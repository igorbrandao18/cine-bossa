export const colors = {
  primary: '#E50914',
  background: '#000000',
  surface: '#1A1A1A',
  surfaceVariant: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#CCCCCC',
  border: '#333333',
  error: '#FF453A',
  success: '#32D74B',
} as const;

export type ThemeColors = keyof typeof colors; 