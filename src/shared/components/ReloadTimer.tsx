import { View, Text, StyleSheet } from 'react-native';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { theme, rem } from '@/theme';
import { getTopPosition } from '@/shared/utils/statusbar';

export function ReloadTimer() {
  const timeUntilReload = useSessionStore(state => state.timeUntilReload);
  const hasCompletedPurchase = useSessionStore(state => state.hasCompletedPurchase);

  if (!hasCompletedPurchase || timeUntilReload === null) return null;

  return (
    <View style={[styles.container, { top: getTopPosition() }]}>
      <Text style={styles.text}>
        O app será recarregado em {timeUntilReload} segundos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: rem(0.5),
    zIndex: 999,
  },
  text: {
    color: '#fff',
    fontSize: rem(0.875),
    fontWeight: '500',
  },
}); 