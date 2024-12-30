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

const SESSION_TYPES = {
  imax: {
    icon: 'theater',
    label: 'IMAX',
    color: '#1B95E0',
  },
  '3d': {
    icon: '3d',
    label: '3D',
    color: '#8E44AD',
  },
  'dbox': {
    icon: 'seat-recline-extra',
    label: 'D-BOX',
    color: '#E67E22',
  },
  'vip': {
    icon: 'star',
    label: 'VIP',
    color: '#F1C40F',
  },
  'standard': {
    icon: 'filmstrip',
    label: '2D',
    color: '#7F8C8D',
  },
} as const;

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
            <Pressable
              key={session.id}
              style={({ pressed }) => [
                styles.sessionCard,
                pressed && styles.sessionCardPressed
              ]}
              onPress={() => router.push(`/seats/${session.id}`)}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTime}>{session.time}</Text>
                <Text style={styles.sessionPrice}>R$ {session.price.toFixed(2)}</Text>
              </View>

              <View style={styles.sessionRoom}>
                <MaterialCommunityIcons 
                  name="door" 
                  size={16} 
                  color="#666"
                />
                <Text style={styles.roomText}>{session.room}</Text>
              </View>

              <View style={styles.sessionTypes}>
                {session.seatTypes.map((type) => (
                  <View 
                    key={type} 
                    style={[
                      styles.typeTag,
                      { backgroundColor: `${SESSION_TYPES[type].color}15` }
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={SESSION_TYPES[type].icon as any}
                      size={14}
                      color={SESSION_TYPES[type].color}
                    />
                    <Text 
                      style={[
                        styles.typeText,
                        { color: SESSION_TYPES[type].color }
                      ]}
                    >
                      {SESSION_TYPES[type].label}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.sessionFeatures}>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons 
                    name="food" 
                    size={16} 
                    color="#666"
                  />
                  <Text style={styles.featureText}>Snack Bar</Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons 
                    name="parking" 
                    size={16} 
                    color="#666"
                  />
                  <Text style={styles.featureText}>Estacionamento</Text>
                </View>
              </View>
            </Pressable>
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
    paddingBottom: 80,
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
    paddingBottom: 100,
  },
  sessionsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  sessionCardPressed: {
    opacity: 0.7,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTime: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  sessionPrice: {
    fontSize: 18,
    color: '#E50914',
    fontWeight: '500',
  },
  sessionRoom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  roomText: {
    color: '#666',
    fontSize: 14,
  },
  sessionTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sessionFeatures: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featureText: {
    color: '#666',
    fontSize: 12,
  },
  backButton: {
    position: 'absolute',
    top: 60,
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