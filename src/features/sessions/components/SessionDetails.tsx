import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { router } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSessionStore } from '../stores/sessionStore';
import type { Session } from '../stores/sessionStore';
import { rem } from '@/core/theme/rem';

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
      <Text style={styles.sessionType}>{session.type}</Text>
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
    return sessions.reduce<Record<string, Session[]>>((acc, session) => {
      if (!acc[session.date]) {
        acc[session.date] = [];
      }
      acc[session.date].push(session);
      return acc;
    }, {});
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
    padding: rem(1),
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: rem(1.5),
  },
  dateGroup: {
    marginBottom: rem(2),
  },
  dateTitle: {
    fontSize: rem(1.125),
    color: '#E50914',
    marginBottom: rem(1),
    fontWeight: '600',
  },
  sessionList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.75),
  },
  sessionButton: {
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    paddingHorizontal: rem(1),
    paddingVertical: rem(0.75),
    borderRadius: rem(0.5),
    minWidth: rem(5),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.3)',
  },
  sessionButtonPressed: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    transform: [{ scale: 0.98 }],
  },
  sessionButtonLabel: {
    color: '#fff',
    fontSize: rem(1.125),
    fontWeight: '600',
    marginBottom: rem(0.25),
  },
  sessionType: {
    color: '#999',
    fontSize: rem(0.75),
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rem(0.5),
    marginTop: rem(1),
  },
  loadingText: {
    color: '#999',
    fontSize: rem(0.875),
  },
  noSessionsText: {
    color: '#999',
    fontSize: rem(1),
    textAlign: 'center',
    lineHeight: rem(1.5),
  },
}); 