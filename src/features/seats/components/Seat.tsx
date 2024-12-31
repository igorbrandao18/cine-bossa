import { TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { useTheme } from '@/shared/hooks/useTheme'
import { Seat as SeatType } from '../types/seat'
import { rem } from '@/shared/utils/dimensions'
import { View } from 'react-native'
import * as Reanimated from 'react-native-reanimated'

interface SeatProps {
  seat: SeatType
  onSelect: (seat: SeatType) => void
}

export function Seat({ seat, onSelect }: SeatProps) {
  const theme = useTheme()

  const styles = StyleSheet.create({
    container: {
      width: rem(2.5),
      height: rem(2.5),
      margin: rem(0.25),
      borderRadius: rem(0.5),
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: rem(0.75),
      color: 'white',
    }
  })

  const getBackgroundColor = () => {
    switch (seat.status) {
      case 'occupied':
        return theme.colors.error
      case 'selected':
        return theme.colors.primary
      default:
        return theme.colors.surface
    }
  }

  return (
    <Reanimated.View entering={Reanimated.FadeIn}>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: getBackgroundColor() }
        ]}
        onPress={() => onSelect(seat)}
        disabled={seat.status === 'occupied'}
      >
        <Text style={styles.text}>{seat.number}</Text>
      </TouchableOpacity>
    </Reanimated.View>
  )
} 