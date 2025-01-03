import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { memo, useCallback } from 'react';
import type { Session } from '../types/session';

interface SessionButtonProps {
  session: Session;
}

const SessionButton = memo(function SessionButton({ session }: SessionButtonProps) {
  const handlePress = useCallback(() => {
    router.push(`/seats/${session.id}`);
  }, [session.id]);

  return (
    <Button
      mode="contained"
      onPress={handlePress}
      style={styles.sessionButton}
      labelStyle={styles.sessionButtonLabel}
    >
      {session.time}
    </Button>
  );
});

interface SessionDetailsProps {
  sessions: Session[];
}

export const SessionDetails = memo(function SessionDetails({ sessions }: SessionDetailsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sessões Disponíveis</Text>
      <View style={styles.sessionList}>
        {sessions.map((session) => (
          <SessionButton key={session.id} session={session} />
        ))}
      </View>
    </View>
  );
});

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