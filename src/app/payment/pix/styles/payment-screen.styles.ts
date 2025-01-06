import { StyleSheet } from 'react-native';
import { rem } from '@/core/theme/rem';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: rem(1),
    gap: rem(1.5),
  },
  qrSection: {
    backgroundColor: '#141414',
    borderRadius: rem(1),
    padding: rem(1.5),
    alignItems: 'center',
    gap: rem(1.5),
  },
  qrWrapper: {
    padding: rem(1.5),
    backgroundColor: '#fff',
    borderRadius: rem(0.5),
  },
  qrInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  qrInfoText: {
    fontSize: rem(0.875),
    color: '#666',
  },
  instructions: {
    backgroundColor: '#141414',
    borderRadius: rem(1),
    padding: rem(1.5),
    gap: rem(1.5),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  stepText: {
    fontSize: rem(0.875),
    color: '#666',
  },
  footerGradient: {
    padding: rem(1),
    paddingBottom: 0,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: rem(1),
  },
  priceInfo: {
    flex: 1,
  },
  totalLabel: {
    color: '#999',
    fontSize: rem(0.875),
  },
  totalPrice: {
    color: '#fff',
    fontSize: rem(1.5),
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#E50914',
    paddingVertical: rem(0.75),
    paddingHorizontal: rem(1.5),
    borderRadius: rem(0.5),
    marginLeft: rem(1),
  },
  payButtonDisabled: {
    opacity: 0.5,
  },
  payButtonText: {
    color: '#fff',
    fontSize: rem(1),
    fontWeight: 'bold',
  },
}); 