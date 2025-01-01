import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { rem } from '../../../core/theme/rem';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
      <Button 
        mode="contained" 
        onPress={onRetry}
        textColor="#fff"
        buttonColor="#E50914"
        style={styles.button}
      >
        Tentar Novamente
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: rem(1),
  },
  errorText: {
    color: '#fff',
    fontSize: rem(1),
    marginBottom: rem(1),
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: rem(1.25),
  },
}); 