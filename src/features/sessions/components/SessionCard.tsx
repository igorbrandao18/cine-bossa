import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../../core/theme/rem';
import type { Session } from '../types/session';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={() => router.push(`/seats/${session.id}`)}
      android_ripple={{ color: 'rgba(255, 255, 255, 0.1)' }}
    >
      <View style={styles.timeContainer}>
        <MaterialCommunityIcons 
          name="clock-outline" 
          size={rem(1.5)} 
          color="#E50914" 
        />
        <Text style={styles.time}>{session.time}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <MaterialCommunityIcons 
            name="theater" 
            size={rem(1.25)} 
            color="#999" 
          />
          <Text style={styles.detailText}>Sala {session.room}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons 
            name="video" 
            size={rem(1.25)} 
            color="#999" 
          />
          <Text style={styles.detailText}>{session.technology}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialCommunityIcons 
            name="currency-usd" 
            size={rem(1.25)} 
            color="#999" 
          />
          <Text style={styles.detailText}>
            R$ {session.price.toFixed(2)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: rem(0.75),
    padding: rem(1),
    marginBottom: rem(1),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
    marginBottom: rem(0.75),
  },
  time: {
    color: '#fff',
    fontSize: rem(1.25),
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.375),
  },
  detailText: {
    color: '#999',
    fontSize: rem(0.875),
  },
}); 