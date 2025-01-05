import { StyleSheet } from 'react-native';
import { rem } from '@/shared/utils/rem';

export const styles = StyleSheet.create({
  instructions: {
    padding: rem(1.5),
    gap: rem(1.5),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  stepText: {
    fontSize: rem(1),
    color: '#666',
  },
}); 