import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { ConfirmationScreen } from '@/features/confirmation/components/ConfirmationScreen';

export default function SuccessScreen() {
  const router = useRouter();
  const clearSelectedSeats = useSessionStore(state => state.clearSelectedSeats);
  const startReloadTimer = useSessionStore(state => state.startReloadTimer);

  useEffect(() => {
    // Inicia o timer de 15 segundos para reload
    startReloadTimer();
  }, []);

  const handleFinish = () => {
    // Limpa os estados
    clearSelectedSeats();
    useSessionStore.setState({ 
      currentSession: null,
      selectedSession: null,
      selectedSeats: []
    });
    
    // Navega para a tela de tickets
    router.push('/tickets');
  };

  return (
    <ConfirmationScreen
      sessionId=""
      onFinish={handleFinish}
    />
  );
} 