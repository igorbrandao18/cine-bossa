import { Alert } from 'react-native';

// Simulação de pagamento
export const processPayment = async (params: {
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  email: string;
}) => {
  // Simula uma chamada à API
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simula validação básica
  if (params.cardNumber.length !== 16) {
    throw new Error('Número do cartão inválido');
  }

  if (params.cvv.length !== 3) {
    throw new Error('CVV inválido');
  }

  // Simula cartões de teste
  const testCards = {
    success: '4242424242424242',
    decline: '4000000000000002',
  };

  if (params.cardNumber === testCards.decline) {
    throw new Error('Cartão recusado');
  }

  // Retorna uma simulação de resposta bem-sucedida
  return {
    success: true,
    transactionId: `TX${Math.random().toString(36).substr(2, 9)}`,
    amount: params.amount,
    last4: params.cardNumber.slice(-4),
  };
}; 