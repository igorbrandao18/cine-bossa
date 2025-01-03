import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import type { Session } from '../types/session';
import { useSessionStore } from '../stores/sessionStore';

interface SessionButtonProps {
  session: Session;
  onPressStart: () => void;
}

const SessionButton = memo(function SessionButton({ session, onPressStart }: SessionButtonProps) {
  const prefetchSession = useSessionStore(state => state.prefetchSession);
  const setSelectedSession = useSessionStore(state => state.setSelectedSession);
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = useCallback(() => {
    setIsPressed(true);
    onPressStart();
    
    setSelectedSession(session.id);
    
    setTimeout(() => {
      router.push(`/seats/${session.id}`);
    }, 50);
  }, [session.id, setSelectedSession, onPressStart]);

  const handlePressIn = useCallback(() => {
    prefetchSession(session.id);
  }, [session.id, prefetchSession]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      style={[
        styles.sessionButton,
        isPressed && styles.sessionButtonPressed
      ]}
    >
      <Text style={styles.sessionButtonLabel}>{session.time}</Text>
    </Pressable>
  );
});

interface SessionDetailsProps {
  sessions: Session[];
}

export const SessionDetails = memo(function SessionDetails({ sessions }: SessionDetailsProps) {
  const loading = useSessionStore(state => state.loading);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);

  const handleSessionPressStart = useCallback((sessionId: string) => {
    setLoadingSessionId(sessionId);
  }, []);

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

  if (loading && sessions.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Carregando sessões...</Text>
      </View>
    );
  }

  if (!loading && sessions.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.noSessionsText}>
          Não há sessões disponíveis no momento.{'\n'}
          Por favor, tente novamente mais tarde.
        </Text>
      </View>
    );
  }

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
              <SessionButton 
                key={session.id} 
                session={session}
                onPressStart={() => handleSessionPressStart(session.id)}
              />
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
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  sessionButtonPressed: {
    backgroundColor: '#B30710',
    transform: [{ scale: 0.98 }],
  },
  sessionButtonLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
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
    marginTop: 12,
  },
  noSessionsText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 