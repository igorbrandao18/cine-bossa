import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Pressable, StatusBar } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { API_CONFIG, SIZES } from '../../../core/config/api';
import { useMovieStore } from '../../../features/movies/stores/movieStore';
import { useSessionStore } from '../../../features/sessions/stores/sessionStore';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const BANNER_HEIGHT = height * 0.65;

export default function MovieScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { sessions, loadSessions } = useSessionStore();
  
  const movie = useMovieStore(state => {
    const sections = state.sections;
    for (const section of Object.values(sections)) {
      const found = section.movies.find(m => m.id === Number(id));
      if (found) return found;
    }
    return null;
  });

  useEffect(() => {
    if (id) {
      loadSessions(Number(id));
    }
  }, [id]);

  if (!movie) return null;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
      </Pressable>

      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image 
            source={{ 
              uri: `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.original}${movie.backdrop_path}` 
            }}
            style={styles.backdrop}
            contentFit="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
            style={styles.gradient}
            locations={[0, 0.6, 1]}
          />
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
            <View style={styles.rating}>
              <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
              <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sessions}>
          <Text style={styles.sessionsTitle}>Sessões Disponíveis</Text>
          {sessions.map(session => (
            <Button
              key={session.id}
              mode="contained"
              style={styles.sessionButton}
              contentStyle={styles.sessionButtonContent}
              onPress={() => router.push(`/seats/${session.id}`)}
            >
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTime}>{session.time}</Text>
                <Text style={styles.sessionRoom}>{session.room}</Text>
                <Text style={styles.sessionPrice}>R$ {session.price.toFixed(2)}</Text>
              </View>
            </Button>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    height: BANNER_HEIGHT,
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BANNER_HEIGHT,
  },
  movieInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
    lineHeight: 20,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 16,
  },
  sessions: {
    padding: 20,
  },
  sessionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sessionButton: {
    backgroundColor: '#1A1A1A',
    marginBottom: 12,
    borderRadius: 12,
  },
  sessionButtonContent: {
    height: 72,
  },
  sessionInfo: {
    flex: 1,
    alignItems: 'center',
  },
  sessionTime: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionRoom: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
  sessionPrice: {
    fontSize: 14,
    color: '#E50914',
    fontWeight: '500',
    marginTop: 4,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 