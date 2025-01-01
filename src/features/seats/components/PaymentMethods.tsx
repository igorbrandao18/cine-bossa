import React from 'react';
import { View, Pressable } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { styles } from './styles/payment-methods.styles';

const PAYMENT_METHODS = [
  { id: 'credit', label: 'Cartão de Crédito', icon: 'credit-card' },
  { id: 'pix', label: 'PIX', icon: 'qrcode' },
  { id: 'boleto', label: 'Boleto', icon: 'barcode' },
] as const;

interface PaymentMethodsProps {
  selectedMethod: typeof PAYMENT_METHODS[number]['id'];
  onSelectMethod: (method: typeof PAYMENT_METHODS[number]['id']) => void;
}

export function PaymentMethods({ selectedMethod, onSelectMethod }: PaymentMethodsProps) {
  return (
    <View style={styles.paymentMethods}>
      <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
      <View style={styles.methodsGrid}>
        {PAYMENT_METHODS.map(method => (
          <Pressable
            key={method.id}
            style={[
              styles.methodCard,
              selectedMethod === method.id && styles.selectedMethod
            ]}
            onPress={() => onSelectMethod(method.id)}
          >
            <MaterialCommunityIcons
              name={method.icon}
              size={24}
              color={selectedMethod === method.id ? colors.primary : colors.text}
            />
            <Text style={[
              styles.methodLabel,
              selectedMethod === method.id && styles.selectedMethodLabel
            ]}>
              {method.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {selectedMethod === 'credit' && (
        <View style={styles.creditCardForm}>
          <TextInput
            mode="outlined"
            label="Número do Cartão"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Validade"
              style={[styles.input, styles.halfInput]}
              theme={{ colors: { primary: colors.primary } }}
            />
            <TextInput
              mode="outlined"
              label="CVV"
              style={[styles.input, styles.halfInput]}
              theme={{ colors: { primary: colors.primary } }}
            />
          </View>
          <TextInput
            mode="outlined"
            label="Nome no Cartão"
            style={styles.input}
            theme={{ colors: { primary: colors.primary } }}
          />
        </View>
      )}

      {selectedMethod === 'pix' && (
        <View style={styles.pixContainer}>
          <View style={styles.qrCodePlaceholder}>
            <MaterialCommunityIcons name="qrcode" size={100} color={colors.text} />
          </View>
          <Text style={styles.pixInstructions}>
            Escaneie o QR Code para pagar
          </Text>
        </View>
      )}
    </View>
  );
} 