import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { useTheme } from '@/shared/hooks/useTheme'
import { rem } from '@/shared/utils/dimensions'

export function SeatsLegend() {
  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: rem(1),
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: rem(0.5),
    },
    dot: {
      width: rem(1),
      height: rem(1),
      borderRadius: rem(0.5),
      marginRight: rem(0.25),
    },
  })

  return (
    <View style={styles.container}>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: theme.colors.surface }]} />
        <Text>Disponível</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: theme.colors.primary }]} />
        <Text>Selecionado</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.dot, { backgroundColor: theme.colors.error }]} />
        <Text>Ocupado</Text>
      </View>
    </View>
  )
} 