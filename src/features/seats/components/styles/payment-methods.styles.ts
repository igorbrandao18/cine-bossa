import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

export const styles = StyleSheet.create({
  paymentMethods: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  methodsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  selectedMethod: {
    backgroundColor: `${colors.primary}20`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  methodLabel: {
    color: colors.text,
    fontSize: 12,
    textAlign: 'center',
  },
  selectedMethodLabel: {
    color: colors.primary,
  },
  creditCardForm: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  pixContainer: {
    alignItems: 'center',
    padding: 24,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pixInstructions: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
  },
}); 