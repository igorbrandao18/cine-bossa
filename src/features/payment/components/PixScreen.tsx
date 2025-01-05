import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { Header } from '@/shared/components/Header';
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