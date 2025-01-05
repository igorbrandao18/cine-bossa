import { View } from 'react-native';
import { Text } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './styles/qr-code-section.styles';

interface QRCodeSectionProps {
  qrCodeValue: string;
}

export function QRCodeSection({ qrCodeValue }: QRCodeSectionProps) {
  return (
    <View style={styles.qrSection}>
      <View style={styles.qrWrapper}>
        <QRCode
          value={qrCodeValue}
          size={200}
          backgroundColor="white"
        />
      </View>

      <View style={styles.qrInfo}>
        <MaterialCommunityIcons 
          name="qrcode" 
          size={24} 
          color="#00875F" 
        />
        <Text style={styles.qrInfoText}>
          Escaneie o QR Code ou copie o código PIX
        </Text>
      </View>
    </View>
  );
} 