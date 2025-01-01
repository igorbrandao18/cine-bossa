import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

export const styles = StyleSheet.create({
  screen: {
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  screenText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
}); 