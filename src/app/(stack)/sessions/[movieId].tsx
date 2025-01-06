import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { SessionDetails } from '@/features/sessions/components/SessionDetails';
import { Header } from '@/components/Header';
import { rem } from '@/core/theme/rem';

export default function SessionsScreen() {
  const { movieId, movieTitle } = useLocalSearchParams();
  const router = useRouter();
  const { sessions, loading, error, loadSessions } = useSessionStore();

  useEffect(() => {
    if (movieId && movieTitle) {
      loadSessions(Number(movieId), movieTitle as string);
    }
  }, [movieId, movieTitle]);

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent 
        backgroundColor="transparent" 
        barStyle="light-content"
      />
      <View style={styles.content}>
        <Header title={movieTitle as string} />
        <SessionDetails sessions={sessions} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingBottom: rem(4), // Espaço para o footer
  },
}); 