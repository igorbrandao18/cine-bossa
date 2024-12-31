import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { theme, rem } from '@/theme';

interface LegendItemProps {
  label: string;
  status: 'available' | 'selected' | 'occupied';
}

export function LegendItem({ label, status }: LegendItemProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.indicator, styles[`indicator${status}`]]} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: rem(1),
    height: rem(1),
    borderRadius: rem(0.125),
    marginRight: rem(0.5),
  },
  indicatoravailable: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  indicatorselected: {
    backgroundColor: theme.colors.primary,
  },
  indicatoroccupied: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  label: {
    fontSize: rem(0.875),
    color: theme.colors.textSecondary,
  },
}); 