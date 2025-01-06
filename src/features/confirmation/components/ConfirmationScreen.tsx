import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/shared/components/Button';
import { theme, rem } from '@/theme';
import { useEffect, useRef } from 'react';

interface ConfirmationScreenProps {
  sessionId: string;
  onFinish: () => void;
}

export function ConfirmationScreen({ onFinish }: ConfirmationScreenProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.animation, { transform: [{ scale: scaleAnim }] }]}>
        <MaterialIcons 
          name="check-circle" 
          size={rem(8)} 
          color={theme.colors.success} 
        />
      </Animated.View>
      
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Compra realizada com sucesso!
      </Text>
      
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Você receberá os ingressos no seu e-mail em instantes.
      </Text>

      <Button 
        variant="primary"
        size="large"
        onPress={onFinish}
        title="Ver meus ingressos"
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rem(1.5),
  },
  animation: {
    width: rem(12),
    height: rem(12),
    marginBottom: rem(2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: rem(1),
  },
  subtitle: {
    fontSize: rem(1),
    textAlign: 'center',
    marginBottom: rem(3),
  },
  button: {
    width: '100%',
    maxWidth: rem(20),
  },
}); 