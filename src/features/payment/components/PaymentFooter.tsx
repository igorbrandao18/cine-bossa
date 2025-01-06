import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/core/theme/colors';
import { styles } from './styles/payment-footer.styles';

interface PaymentFooterProps {
  amount: string;
  loading: boolean;
  onConfirmPayment: () => void;
}

export function PaymentFooter({ amount, loading, onConfirmPayment }: PaymentFooterProps) {
  return (
    <LinearGradient
      colors={colors.gradients.surface}
      style={styles.footerGradient}
    >
      <View style={styles.footer}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>Total com desconto</Text>
          <Text style={styles.totalPrice}>
            R$ {amount}
          </Text>
        </View>
        <Pressable
          style={[
            styles.payButton,
            loading && styles.payButtonDisabled
          ]}
          onPress={onConfirmPayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? 'Processando...' : 'Já realizei o pagamento'}
          </Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
} 