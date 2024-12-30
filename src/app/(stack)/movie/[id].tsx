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
            <View style={styles.movieMeta}>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}</Text>
              </View>
              <View style={styles.classification}>
                <Text style={styles.classificationText}>14</Text>
              </View>
            </View>
            <Text style={styles.overview}>{movie.overview}</Text>
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
              <LinearGradient
                colors={['#1A1A1A', '#262626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sessionGradient}
              >
                <View style={styles.sessionMainInfo}>
                  <View style={styles.timeContainer}>
                    <Text style={styles.sessionTime}>{session.time}</Text>
                    <View style={styles.sessionBadge}>
                      <Text style={styles.sessionBadgeText}>HOJE</Text>
                    </View>
                  </View>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>A partir de</Text>
                    <View style={styles.priceWrapper}>
                      <Text style={styles.priceCurrency}>R$</Text>
                      <Text style={styles.sessionPrice}>{session.price.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sessionDivider} />

                <View style={styles.sessionTypes}>
                  {session.seatTypes.map((type) => (
                    <View 
                      key={type} 
                      style={[
                        styles.typeTag,
                        { backgroundColor: `${SESSION_TYPES[type].color}20` }
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={SESSION_TYPES[type].icon as any}
                        size={18}
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

                <View style={styles.sessionDetails}>
                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons 
                      name="door" 
                      size={20} 
                      color="#E50914"
                    />
                    <View>
                      <Text style={styles.detailLabel}>Sala</Text>
                      <Text style={styles.detailText}>{session.room}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons 
                      name="seat" 
                      size={20} 
                      color="#E50914"
                    />
                    <View>
                      <Text style={styles.detailLabel}>Lugares</Text>
                      <Text style={styles.detailText}>Disponível</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <MaterialCommunityIcons 
                      name="surround-sound" 
                      size={20} 
                      color="#E50914"
                    />
                    <View>
                      <Text style={styles.detailLabel}>Áudio</Text>
                      <Text style={styles.detailText}>Dolby Atmos</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.sessionFooter}>
                  <View style={styles.amenities}>
                    <MaterialCommunityIcons name="food" size={16} color="#666" />
                    <MaterialCommunityIcons name="parking" size={16} color="#666" />
                    <MaterialCommunityIcons name="wheelchair-accessibility" size={16} color="#666" />
                  </View>
                  <View style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>Comprar</Text>
                    <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
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
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  sessionCardPressed: {
    opacity: 0.7,
  },
  sessionGradient: {
    padding: 16,
  },
  sessionMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  sessionBadge: {
    backgroundColor: '#E50914',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  sessionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  priceCurrency: {
    color: '#E50914',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sessionPrice: {
    fontSize: 32,
    color: '#E50914',
    fontWeight: 'bold',
  },
  sessionDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 16,
  },
  sessionTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    color: '#666',
    fontSize: 12,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amenities: {
    flexDirection: 'row',
    gap: 12,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E50914',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  classification: {
    width: 32,
    height: 32,
    backgroundColor: '#E50914',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classificationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 2,
  },
}); 