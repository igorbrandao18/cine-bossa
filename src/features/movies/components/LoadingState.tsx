import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { rem } from '../../../core/theme/rem';

export function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={rem(2)} color="#E50914" />
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
}); 