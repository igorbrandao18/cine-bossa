import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme, rem } from '@/theme';

export function HeaderBackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => router.back()}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialIcons 
        name="arrow-back-ios" 
        size={rem(1.5)} 
        color={theme.colors.text} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: rem(2.5),
    height: rem(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 