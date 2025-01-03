import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from '@/shared/components/Text';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { rem } from '@/shared/utils/rem';

const SESSION_TYPES = {
  imax: {
    icon: 'theater',
    label: 'IMAX',
    color: '#1B95E0',
  },
  '3d': {
    icon: 'glasses',
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

export default function SessionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedMovie } = useMovieStore();
  const { sessions, loadSessions, setSelectedSession } = useSessionStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMovieSessions = async () => {
      try {
        setLoading(true);
        await loadSessions(Number(id), selectedMovie?.title || '');
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedMovie) {
      loadMovieSessions();
    }
  }, [id, selectedMovie]);

  const handleSessionPress = (sessionId: string) => {
    setSelectedSession(sessionId);
    router.push(`/seats/${sessionId}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando sessões...</Text>
      </View>
    );
  }

  const movieSessions = sessions.filter(session => session.movieId === id);

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sessões Disponíveis</Text>
          <Text style={styles.subtitle}>{selectedMovie?.title}</Text>
        </View>

        {movieSessions.length > 0 ? (
          <View style={styles.sessionsList}>
            {movieSessions.map(session => (
              <Pressable
                key={session.id}
                style={({ pressed }) => [
                  styles.sessionCard,
                  pressed && styles.sessionCardPressed
                ]}
                onPress={() => handleSessionPress(session.id)}
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
                        <Text style={styles.sessionBadgeText}>
                          {session.isToday ? 'HOJE' : session.date}
                        </Text>
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
        ) : (
          <View style={styles.noSessionsContainer}>
            <MaterialCommunityIcons name="calendar-remove" size={48} color="#666" />
            <Text style={styles.noSessionsText}>
              Nenhuma sessão disponível para este filme
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: rem(2),
    left: rem(1),
    zIndex: 10,
    width: rem(2.5),
    height: rem(2.5),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: rem(1.25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: rem(1),
  },
  title: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    marginBottom: rem(0.5),
  },
  subtitle: {
    fontSize: rem(1),
    opacity: 0.7,
  },
  sessionsList: {
    padding: rem(1),
  },
  sessionCard: {
    marginBottom: rem(1),
    borderRadius: rem(1),
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
    padding: rem(1),
  },
  sessionMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
  },
  sessionTime: {
    fontSize: rem(2),
    fontWeight: 'bold',
  },
  sessionBadge: {
    backgroundColor: '#E50914',
    paddingHorizontal: rem(0.5),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.25),
  },
  sessionBadgeText: {
    fontSize: rem(0.75),
    fontWeight: 'bold',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: rem(0.75),
    opacity: 0.6,
    marginBottom: rem(0.125),
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: rem(0.25),
  },
  priceCurrency: {
    color: '#E50914',
    fontSize: rem(1),
    fontWeight: 'bold',
    marginBottom: rem(0.25),
  },
  sessionPrice: {
    fontSize: rem(2),
    color: '#E50914',
    fontWeight: 'bold',
  },
  sessionDivider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: rem(1),
  },
  sessionTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.5),
    marginBottom: rem(1),
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.375),
    paddingHorizontal: rem(0.75),
    paddingVertical: rem(0.375),
    borderRadius: rem(0.5),
  },
  typeText: {
    fontSize: rem(0.875),
    fontWeight: '600',
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rem(1),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  detailLabel: {
    opacity: 0.6,
    fontSize: rem(0.75),
  },
  detailText: {
    fontSize: rem(0.875),
    fontWeight: '500',
  },
  sessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rem(0.5),
  },
  amenities: {
    flexDirection: 'row',
    gap: rem(0.75),
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
    backgroundColor: '#E50914',
    paddingHorizontal: rem(1),
    paddingVertical: rem(0.5),
    borderRadius: rem(0.5),
  },
  buyButtonText: {
    fontSize: rem(1),
    fontWeight: '600',
  },
  noSessionsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: rem(2),
  },
  noSessionsText: {
    marginTop: rem(1),
    fontSize: rem(1),
    opacity: 0.6,
    textAlign: 'center',
  },
}); 