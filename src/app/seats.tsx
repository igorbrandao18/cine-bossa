import { View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { SeatsScreen } from '@/features/seats/components/SeatsScreen'

export default function SeatsPage() {
  const { sessionId } = useLocalSearchParams()
  
  return (
    <View style={{ flex: 1 }}>
      <SeatsScreen sessionId={sessionId as string} />
    </View>
  )
} 