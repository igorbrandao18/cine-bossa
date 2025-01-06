import { StyleSheet } from 'react-native';
import { rem } from '@/shared/utils/rem';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  footerGradient: {
    paddingTop: rem(2),
    paddingHorizontal: rem(1.5),
    paddingBottom: rem(4.5),
  },
  footer: {
    gap: rem(1),
  },
  priceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: rem(1),
    color: '#999',
  },
  totalPrice: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
    color: '#fff',
  },
  payButton: {
    backgroundColor: '#00875F',
    padding: rem(1),
    borderRadius: rem(0.5),
    alignItems: 'center',
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#fff',
    fontSize: rem(1),
    fontWeight: '500',
  },
}); 