import { View, StyleSheet } from 'react-native'
import { Button, Card, Text } from 'react-native-paper'
import { Session } from '../types/session'
import { useAppNavigation } from '@/core/navigation/useAppNavigation'
import { rem } from '@/shared/utils/dimensions'
import { Link } from 'expo-router'

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  const navigate = useAppNavigation()

  return (
    <Card style={styles.container}>
      <Card.Content>
        <View style={styles.content}>
          <View>
            <Text variant="titleMedium" style={styles.time}>
              {session.time}
            </Text>
            <Text variant="bodyMedium" style={styles.type}>
              {session.type}
            </Text>
            <Text variant="bodySmall" style={styles.room}>
              {session.room}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text variant="titleLarge" style={styles.price}>
              R$ {session.price.toFixed(2)}
            </Text>
            <Link href={`/seats/${session.id}`} asChild>
              <Button 
                mode="contained"
                style={styles.button}
              >
                Comprar
              </Button>
            </Link>
          </View>
        </View>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: rem(1),
    backgroundColor: '#1A1A1A',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: '#FFF',
    marginBottom: rem(0.25),
  },
  type: {
    color: '#CCC',
    marginBottom: rem(0.25),
  },
  room: {
    color: '#999',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: '#E50914',
    marginBottom: rem(0.5),
  },
  button: {
    minWidth: rem(7.5),
  },
}) 