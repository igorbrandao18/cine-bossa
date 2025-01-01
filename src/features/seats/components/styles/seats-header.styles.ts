import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    height: 56,
  },
  backButton: {
    margin: 0,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  sessionInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
}); 