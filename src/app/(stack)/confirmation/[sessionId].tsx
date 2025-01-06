import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ConfirmationScreen } from '@/features/confirmation/components/ConfirmationScreen';

export default function ConfirmationPage() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const router = useRouter();

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Confirmação',
          headerBackTitle: 'Voltar'
        }} 
      />
      <ConfirmationScreen 
        sessionId={sessionId} 
        onFinish={() => router.push('/')}
      />
    </>
  );
} 