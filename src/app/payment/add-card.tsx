import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { rem } from '../../core/theme/rem';
import { Header } from '../../shared/components/Header';
import { Button } from '../../shared/components/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCardStore } from '../../features/payment/stores/cardStore';

export default function AddCardScreen() {
  const router = useRouter();
  const addCard = useCardStore(state => state.addCard);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleSave = () => {
    // Detectar a bandeira do cartão
    const firstDigit = cardNumber.charAt(0);
    const brand = firstDigit === '4' ? 'visa' : 'mastercard';

    // Adicionar cartão ao store
    addCard({
      number: cardNumber.replace(/\s/g, ''),
      name: cardName,
      expiryDate,
      brand,
    });

    router.back();
  };

  const isFormValid = () => {
    return (
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardName.length >= 3 &&
      expiryDate.length === 5 &&
      cvv.length >= 3
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Adicionar cartão" />
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="credit-card" size={24} color="#E50914" />
            <Text style={styles.cardHeaderText}>Informações do cartão</Text>
          </View>

          <TextInput
            label="Número do cartão"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            style={styles.input}
            keyboardType="numeric"
            maxLength={19}
            mode="outlined"
            outlineColor="rgba(255,255,255,0.1)"
            activeOutlineColor="#E50914"
            textColor="#fff"
            theme={{ colors: { onSurfaceVariant: 'rgba(255,255,255,0.5)' }}}
          />

          <TextInput
            label="Nome no cartão"
            value={cardName}
            onChangeText={setCardName}
            style={styles.input}
            autoCapitalize="characters"
            mode="outlined"
            outlineColor="rgba(255,255,255,0.1)"
            activeOutlineColor="#E50914"
            textColor="#fff"
            theme={{ colors: { onSurfaceVariant: 'rgba(255,255,255,0.5)' }}}
          />

          <View style={styles.row}>
            <TextInput
              label="Validade"
              value={expiryDate}
              onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              maxLength={5}
              mode="outlined"
              outlineColor="rgba(255,255,255,0.1)"
              activeOutlineColor="#E50914"
              textColor="#fff"
              theme={{ colors: { onSurfaceVariant: 'rgba(255,255,255,0.5)' }}}
            />

            <TextInput
              label="CVV"
              value={cvv}
              onChangeText={(text) => setCvv(text.replace(/\D/g, ''))}
              style={[styles.input, styles.halfInput]}
              keyboardType="numeric"
              maxLength={4}
              mode="outlined"
              outlineColor="rgba(255,255,255,0.1)"
              activeOutlineColor="#E50914"
              textColor="#fff"
              theme={{ colors: { onSurfaceVariant: 'rgba(255,255,255,0.5)' }}}
              right={
                <TextInput.Icon 
                  icon="credit-card-check" 
                  color="rgba(255,255,255,0.5)"
                />
              }
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Button 
            onPress={handleSave}
            title="Salvar cartão"
            variant="primary"
            size="large"
            fullWidth
            disabled={!isFormValid()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: rem(1.25),
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
    padding: rem(1.25),
    gap: rem(1),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
    marginBottom: rem(0.5),
  },
  cardHeaderText: {
    color: '#fff',
    fontSize: rem(1),
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: rem(1),
  },
  row: {
    flexDirection: 'row',
    gap: rem(1),
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    marginTop: rem(2),
  },
}); 