import { StyleSheet } from 'react-native';
import { colors } from '@/core/theme/colors';

export const styles = StyleSheet.create({
  summary: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  summaryContent: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 24,
  },
  movieInfo: {
    gap: 12,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  sessionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sessionDetailsText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  seatsInfo: {
    gap: 12,
  },
  seatsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  seatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  seatCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  seatBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seatText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  seatType: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  seatPrice: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  priceBreakdown: {
    gap: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  priceValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  totalRow: {
    marginTop: 4,
  },
  totalLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 