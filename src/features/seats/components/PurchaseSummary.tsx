import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { Button } from '@/shared/components/Button';
import { theme, rem } from '@/theme';

interface PurchaseSummaryProps {
  style?: ViewStyle;
  quantity: number;
  total: number;
  onPurchase: () => void;
}

export function PurchaseSummary({ style, quantity, total, onPurchase }: PurchaseSummaryProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.info}>
        <Text style={styles.quantity}>
          {quantity} ingresso{quantity !== 1 ? 's' : ''}
        </Text>
        <Text style={styles.total}>
          R$ {total.toFixed(2)}
        </Text>
      </View>

      <Button
        mode="contained"
        onPress={onPurchase}
        disabled={quantity === 0}
        style={styles.button}
      >
        Continuar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: rem(1.5),
    backgroundColor: theme.colors.surface,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(1),
  },
  quantity: {
    fontSize: rem(1),
    color: theme.colors.textSecondary,
  },
  total: {
    fontSize: rem(1.25),
    fontWeight: '600',
    color: theme.colors.text,
  },
  button: {
    width: '100%',
  },
}); 