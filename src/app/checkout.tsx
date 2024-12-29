import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Text, Button, TextInput, Card, Divider, Portal, Dialog } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { processPayment } from '../services/payment';
import { Alert } from 'react-native';

// Dados mockados (depois substituir por API)
const MOCK_SESSION = {
  movieTitle: 'Duna: Parte 2',
  room: 'Sala VIP',
  type: 'IMAX',
  datetime: '2024-03-20T14:30:00',
};

export default function CheckoutScreen() {
  const { seats, total, sessionId } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Remove espaços e caracteres especiais do número do cartão
      const cleanCardNumber = formData.cardNumber.replace(/\D/g, '');

      const result = await processPayment({
        amount: Number(total),
        cardNumber: cleanCardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        email: formData.email,
      });

      setShowSuccessDialog(true);
    } catch (error) {
      Alert.alert(
        'Erro no Pagamento',
        error instanceof Error ? error.message : 'Ocorreu um erro ao processar o pagamento'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowSuccessDialog(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Animated.View entering={FadeInDown} style={styles.content}>
          <Card style={styles.orderCard}>
            <Card.Content>
              <Text style={styles.title}>Resumo do Pedido</Text>
              <View style={styles.orderDetails}>
                <Text style={styles.movieTitle}>{MOCK_SESSION.movieTitle}</Text>
                <Text style={styles.sessionInfo}>
                  {MOCK_SESSION.room} • {MOCK_SESSION.type}
                </Text>
                <Text style={styles.sessionInfo}>
                  {new Date(MOCK_SESSION.datetime).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                <Text style={styles.seatsInfo}>
                  Assentos: {seats}
                </Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.priceContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>
                  R$ {Number(total).toFixed(2)}
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.paymentCard}>
            <Card.Content>
              <Text style={styles.title}>Dados de Pagamento</Text>
              <TextInput
                label="Nome no Cartão"
                value={formData.name}
                onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                style={styles.input}
                mode="outlined"
              />
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={text => setFormData(prev => ({ ...prev, email: text }))}
                style={styles.input}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TextInput
                label="Número do Cartão"
                value={formData.cardNumber}
                onChangeText={text => setFormData(prev => ({ ...prev, cardNumber: text }))}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                maxLength={16}
              />
              <View style={styles.row}>
                <TextInput
                  label="Validade"
                  value={formData.expiryDate}
                  onChangeText={text => setFormData(prev => ({ ...prev, expiryDate: text }))}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                  placeholder="MM/AA"
                  maxLength={5}
                />
                <TextInput
                  label="CVV"
                  value={formData.cvv}
                  onChangeText={text => setFormData(prev => ({ ...prev, cvv: text }))}
                  style={[styles.input, styles.halfInput]}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </Card.Content>
          </Card>
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <LinearGradient
          colors={['transparent', '#000']}
          style={StyleSheet.absoluteFill}
        />
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonLabel}
          loading={loading}
          disabled={loading}
          onPress={handlePayment}
        >
          {loading ? 'Processando...' : 'Finalizar Compra'}
        </Button>
      </View>

      <Portal>
        <Dialog
          visible={showSuccessDialog}
          onDismiss={handleSuccess}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Compra Realizada!
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Sua compra foi realizada com sucesso! Um email de confirmação foi enviado com os ingressos.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={handleSuccess}
              textColor="#E50914"
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#1a1a1a',
  },
  paymentCard: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderDetails: {
    gap: 4,
  },
  movieTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sessionInfo: {
    color: '#666',
    fontSize: 14,
  },
  seatsInfo: {
    color: '#fff',
    marginTop: 8,
  },
  divider: {
    backgroundColor: '#333',
    marginVertical: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: '#666',
    fontSize: 16,
  },
  totalPrice: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: 16,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  button: {
    backgroundColor: '#E50914',
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
  dialog: {
    backgroundColor: '#1a1a1a',
  },
  dialogTitle: {
    color: '#fff',
  },
  dialogText: {
    color: '#fff',
  },
}); 