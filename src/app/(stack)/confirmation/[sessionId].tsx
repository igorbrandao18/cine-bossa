import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/shared/hooks/useTheme';
import { PurchaseConfirmation } from '@/features/seats/components/PurchaseConfirmation';

export default function ConfirmationScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <PurchaseConfirmation sessionId={sessionId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 