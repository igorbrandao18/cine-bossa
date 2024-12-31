import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { rem } from '@/shared/utils/rem';

export default function SuccessScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(tabs)/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('@/assets/animations/success.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text variant="headlineMedium" style={styles.title}>
        Compra Realizada com Sucesso!
      </Text>
      <Text style={styles.subtitle}>
        Seus ingressos foram enviados para seu e-mail
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: rem(2),
  },
  animation: {
    width: rem(15),
    height: rem(15),
  },
  title: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: rem(2),
  },
  subtitle: {
    color: '#999',
    textAlign: 'center',
    marginTop: rem(1),
  },
}); 