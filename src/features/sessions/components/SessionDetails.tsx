import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
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
  // Agrupar sessões por data
  const groupedSessions = useMemo(() => {
    return sessions.reduce((acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = [];
      }
      acc[session.date].push(session);
      return acc;
    }, {} as Record<string, Session[]>);
  }, [sessions]);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Sessões Disponíveis</Text>
      {Object.entries(groupedSessions).map(([date, dateSessions]) => (
        <View key={date} style={styles.dateGroup}>
          <Text style={styles.dateTitle}>
            {dateSessions[0].isToday ? 'Hoje' : date}
          </Text>
          <View style={styles.sessionList}>
            {dateSessions.map((session) => (
              <SessionButton key={session.id} session={session} />
            ))}
          </View>
        </View>
      ))}
      {sessions.length === 1 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#E50914" />
          <Text style={styles.loadingText}>Carregando mais sessões...</Text>
        </View>
      )}
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
  dateGroup: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 12,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  loadingText: {
    color: '#999',
    fontSize: 14,
  },
}); 