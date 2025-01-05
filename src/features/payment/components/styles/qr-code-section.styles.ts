import { StyleSheet } from 'react-native';
import { rem } from '@/shared/utils/rem';

export const styles = StyleSheet.create({
  qrSection: {
    alignItems: 'center',
    padding: rem(1.5),
  },
  qrWrapper: {
    padding: rem(1.5),
    backgroundColor: 'white',
    borderRadius: rem(1),
    marginBottom: rem(1.5),
  },
  qrInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  qrInfoText: {
    color: '#00875F',
    fontSize: rem(1),
  },
}); 