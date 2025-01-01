import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import type { Session } from '../types/session';

interface SessionDetailsProps {
  sessions: Session[];
}

export function SessionDetails({ sessions }: SessionDetailsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sessões Disponíveis</Text>
      <View style={styles.sessionList}>
        {sessions.map((session) => (
          <Button
            key={session.id}
            mode="contained"
            onPress={() => router.push(`/seats/${session.id}`)}
            style={styles.sessionButton}
            labelStyle={styles.sessionButtonLabel}
          >
            {session.time}
          </Button>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sessionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sessionButton: {
    backgroundColor: '#E50914',
  },
  sessionButtonLabel: {
    color: '#fff',
  },
}); 