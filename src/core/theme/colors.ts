export const colors = {
  // Cores principais da Netflix
  primary: '#E50914',
  primaryDark: '#B71C1C',
  secondary: '#831010',
  
  // Backgrounds
  background: '#000000',
  surface: '#141414',
  surfaceLight: '#1A1A1A',
  surfaceDark: '#0A0A0A',
  
  // Textos
  text: '#FFFFFF',
  textSecondary: '#999999',
  textMuted: '#666666',
  
  // Estados
  success: '#46D369',
  error: '#E50914',
  warning: '#F5B014',
  info: '#0080FF',
  
  // Gradientes
  gradients: {
    primary: ['#E50914', '#B71C1C'],
    surface: ['transparent', 'rgba(0,0,0,0.95)', '#000'],
    button: ['#E50914', '#B71C1C'],
  },
  
  // Opacidades
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(0, 0, 0, 0.5)',
    darker: 'rgba(0, 0, 0, 0.8)',
    darkest: 'rgba(0, 0, 0, 0.95)',
  },
  
  // Bordas
  border: 'rgba(255, 255, 255, 0.1)',
} as const;

export type ThemeColors = keyof typeof colors; 