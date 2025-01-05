import { StyleSheet } from 'react-native';
import { rem } from '@/core/theme/rem';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    padding: rem(1),
    gap: rem(1.5),
    paddingBottom: rem(5),
  },
  qrSection: {
    alignItems: 'center',
    gap: rem(1.5),
  },
  qrWrapper: {
    padding: rem(1.5),
    backgroundColor: '#fff',
    borderRadius: rem(1),
  },
  qrInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  qrInfoText: {
    color: '#00875F',
    fontSize: rem(1),
    fontWeight: '500',
  },
  instructions: {
    gap: rem(1.5),
    marginTop: rem(1),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
  },
  stepText: {
    color: '#fff',
    fontSize: rem(1),
  },
  footerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    color: '#00875F',
    fontSize: rem(1.5),
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#00875F',
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