import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles/payment-instructions.styles';

export function PaymentInstructions() {
  return (
    <View style={styles.instructions}>
      <View style={styles.step}>
        <MaterialCommunityIcons
          name="cellphone"
          size={24}
          color="#666"
        />
        <Text style={styles.stepText}>
          Abra o app do seu banco
        </Text>
      </View>

      <View style={styles.step}>
        <MaterialCommunityIcons
          name="qrcode-scan"
          size={24}
          color="#666"
        />
        <Text style={styles.stepText}>
          Escaneie o QR Code ou copie o código
        </Text>
      </View>

      <View style={styles.step}>
        <MaterialCommunityIcons
          name="check-circle"
          size={24}
          color="#666"
        />
        <Text style={styles.stepText}>
          Confirme o pagamento no app
        </Text>
      </View>
    </View>
  );
} 