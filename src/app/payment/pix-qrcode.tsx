import { View, StyleSheet, Share } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { rem } from '../../core/theme/rem';
import { Button } from '../../shared/components/Button';
import { Card } from '../../shared/components/Card';
import QRCodeAnimation from '../../assets/animations/qr-code.json';

export default function PixQRCodeScreen() {
  const { totalPrice } = useLocalSearchParams<{ totalPrice: string }>();
  const price = parseFloat(totalPrice || '0');
  const qrCodeValue = 'dummy-qr-code-value'; // This should come from your backend

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Código PIX: ${qrCodeValue}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyCode = () => {
    // Implement clipboard copy
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Card variant="elevated" style={styles.qrContainer}>
          <View style={styles.header}>
            <MaterialCommunityIcons name="qrcode" size={rem(1.5)} color="#00875F" />
            <Text style={styles.title}>QR Code PIX</Text>
          </View>

          <View style={styles.qrWrapper}>
            <LottieView
              source={QRCodeAnimation}
              autoPlay
              loop={false}
              style={styles.qrAnimation}
            />
          </View>

          <View style={styles.priceInfo}>
            <Text style={styles.priceLabel}>Valor a pagar</Text>
            <Text style={styles.price}>R$ {price.toFixed(2)}</Text>
          </View>

          <Text style={styles.instructions}>
            Abra o app do seu banco, escaneie o QR Code ou copie o código PIX
          </Text>
        </Card>

        <View style={styles.actions}>
          <Button
            title="Copiar código"
            onPress={handleCopyCode}
            variant="secondary"
            fullWidth
          />
          <Button
            title="Compartilhar"
            onPress={handleShare}
            variant="outline"
            fullWidth
          />
        </View>
      </View>

      <Button
        title="Voltar para o início"
        onPress={() => router.push('/')}
        variant="primary"
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: rem(1),
  },
  content: {
    flex: 1,
    gap: rem(1.5),
  },
  qrContainer: {
    padding: rem(1.5),
    alignItems: 'center',
    gap: rem(1.5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  title: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
    color: '#fff',
  },
  qrWrapper: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: rem(1),
    padding: rem(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrAnimation: {
    width: '100%',
    height: '100%',
  },
  priceInfo: {
    alignItems: 'center',
    gap: rem(0.25),
  },
  priceLabel: {
    fontSize: rem(0.875),
    color: '#808080',
  },
  price: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#00875F',
  },
  instructions: {
    fontSize: rem(0.875),
    color: '#808080',
    textAlign: 'center',
    opacity: 0.8,
  },
  actions: {
    gap: rem(1),
  },
}); 