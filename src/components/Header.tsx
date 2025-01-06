import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { rem } from '@/core/theme/rem';
import { getTopPosition } from '@/core/utils/statusBar';

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export function Header({ title, onBack }: HeaderProps) {
  const topPosition = getTopPosition();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[styles.container, { marginTop: topPosition }]}>
      <View style={styles.header}>
        <Pressable 
          style={styles.backButton}
          onPress={handleBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: rem(3.5),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rem(1),
  },
  backButton: {
    width: rem(2.5),
    height: rem(2.5),
    borderRadius: rem(1.25),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: rem(1.125),
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: -rem(2.5), // Compensa a largura do botão voltar
  },
}); 