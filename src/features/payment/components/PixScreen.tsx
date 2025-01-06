import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@/shared/components/Header';
import { QRCodeSection } from './QRCodeSection';
import { PaymentInstructions } from './PaymentInstructions';
import { colors } from '@/core/theme/colors';
import { styles } from './styles/pix-screen.styles';

export default function PixScreen() {
  const { amount } = useLocalSearchParams<{ amount: string }>();
  const [loading, setLoading] = useState(false);
  const [qrCodeValue] = useState('00020126580014BR.GOV.BCB.PIX0136123e4567-e12b-12d1-a456-4266554400005204000053039865802BR5913Cine Bossa SA6008Brasilia62070503***63041234');

  const handleConfirmPayment = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    router.push('/(stack)/success');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Pagamento PIX"
        variant="transparent"
        alignment="center"
      />

      <SafeAreaView style={styles.content} edges={['bottom']}>
        <ScrollView 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <QRCodeSection qrCodeValue={qrCodeValue} />
          <PaymentInstructions />
        </ScrollView>

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
              onPress={handleConfirmPayment}
              disabled={loading}
            >
              <Text style={styles.payButtonText}>
                {loading ? 'Processando...' : 'Já realizei o pagamento'}
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </SafeAreaView>
    </View>
  );
} 