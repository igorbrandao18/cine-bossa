import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image, Pressable, StatusBar, Dimensions, NativeSyntheticEvent, NativeScrollEvent, PixelRatio } from 'react-native';
import { Text, Button, Chip, Card, Divider, Portal, Modal, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSessionStore } from '../../features/sessions/stores/sessionStore';
import { useMovieStore } from '../../features/movies/stores/movieStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { API_CONFIG, SIZES } from '../../core/config/api';
import { LinearGradient } from 'expo-linear-gradient';
import { SEAT_TYPES } from '../../features/seats/types/seats';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;
const HEADER_HEIGHT = height * 0.65;

// Utility function to convert REM to pixels
const rem = (value: number) => {
  return PixelRatio.roundToNearestPixel(value * 16);
};

export default function SessionsScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const { sessions, loading, error, loadSessions } = useSessionStore();
  const [showBackButton, setShowBackButton] = useState(false);
  
  const movie = useMovieStore(state => {
    const sections = state.sections;
    for (const section of Object.values(sections)) {
      const found = section.data.find(m => m.id === Number(movieId));
      if (found) return found;
    }
    return null;
  });

  const [selectedSeatType, setSelectedSeatType] = useState<keyof typeof SEAT_TYPES | null>(null);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setShowBackButton(scrollY > 50);
  }, []);

  useEffect(() => {
    if (movieId) {
      loadSessions(Number(movieId));
    }
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={() => loadSessions(Number(movieId))}
          buttonColor="#E50914"
          textColor="#fff"
        >
          Tentar Novamente
        </Button>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <Text style={styles.errorText}>Filme não encontrado</Text>
      </View>
    );
  }

  const renderSeatTypeModal = () => (
    <Portal>
      <Modal
        visible={!!selectedSeatType}
        onDismiss={() => setSelectedSeatType(null)}
        contentContainerStyle={styles.modal}
      >
        {selectedSeatType && (
          <>
            <View style={styles.modalHeader}>
              <View style={[styles.seatTypeIcon, { backgroundColor: SEAT_TYPES[selectedSeatType].color }]}>
                <MaterialCommunityIcons
                  name={selectedSeatType === 'd-box' ? 'seat-recline-extra' :
                        selectedSeatType === 'imax' ? 'theater' :
                        selectedSeatType === 'vip' ? 'seat-legroom-extra' :
                        selectedSeatType === 'couple' ? 'sofa' : 'seat'}
                  size={24}
                  color="#000"
                />
              </View>
              <Text style={styles.modalTitle}>{SEAT_TYPES[selectedSeatType].title}</Text>
            </View>
            <Text style={styles.modalDescription}>
              {SEAT_TYPES[selectedSeatType].description}
            </Text>
            <View style={styles.modalBenefits}>
              {SEAT_TYPES[selectedSeatType].benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <MaterialCommunityIcons name="check-circle" size={16} color="#E50914" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </>
        )}
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {showBackButton && (
        <Pressable 
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backButtonPressed
          ]}
          onPress={() => router.back()}
        >
          <View style={styles.backButtonInner}>
            <MaterialCommunityIcons name="chevron-left" size={28} color="#fff" />
          </View>
        </Pressable>
      )}

      <ScrollView 
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.header}>
          <Image 
            source={{ 
              uri: `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.original}${movie.backdrop_path}` 
            }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)', '#000']}
            style={styles.gradient}
            locations={[0, 0.6, 1]}
          />
          <View style={styles.movieInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.overview} numberOfLines={2}>
              {movie.overview}
            </Text>
            <View style={styles.tags}>
              <Chip 
                mode="outlined" 
                textStyle={styles.chipText}
                style={styles.chip}
              >
                {format(new Date(movie.release_date), 'yyyy')}
              </Chip>
              <Chip 
                mode="outlined" 
                textStyle={styles.chipText}
                style={styles.chip}
              >
                {movie.vote_average.toFixed(1)} ⭐
              </Chip>
            </View>
          </View>
        </View>

        <View style={styles.sessions}>
          {sessions.map(session => (
            <Pressable
              key={session.id}
              onPress={() => router.push(`/seats/${session.id}`)}
              style={({ pressed }) => [
                styles.sessionCard,
                pressed && styles.sessionCardPressed
              ]}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.time}>{session.time}</Text>
                <Text style={styles.price}>R$ {session.price.toFixed(2)}</Text>
              </View>

              <View style={styles.roomContainer}>
                <MaterialCommunityIcons 
                  name={session.room.includes('IMAX') ? 'theater' : 
                       session.room.includes('Premium') ? 'star-circle' : 
                       'crown'}
                  size={18} 
                  color="#E50914" 
                />
                <Text style={styles.room}>{session.room}</Text>
              </View>

              <View style={styles.seatTypes}>
                {session.seatTypes.map(type => (
                  <View key={type} style={[styles.seatTypeTag, { backgroundColor: `${SEAT_TYPES[type].color}15` }]}>
                    <MaterialCommunityIcons
                      name={type === 'd-box' ? 'seat-recline-extra' :
                            type === 'imax' ? 'theater' :
                            type === 'vip' ? 'seat-legroom-extra' :
                            type === 'couple' ? 'sofa' : 'seat'}
                      size={14}
                      color={SEAT_TYPES[type].color}
                    />
                    <Text style={[styles.seatTypeText, { color: SEAT_TYPES[type].color }]}>
                      {SEAT_TYPES[type].title}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        {renderSeatTypeModal()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: HEADER_HEIGHT,
    position: 'relative',
    marginBottom: rem(1),
    marginTop: -STATUS_BAR_HEIGHT,
  },
  backdrop: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
  },
  movieInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: rem(1),
    paddingBottom: rem(2),
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HEADER_HEIGHT,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: rem(1.75),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: rem(0.5),
  },
  overview: {
    fontSize: rem(0.875),
    color: '#ccc',
    marginBottom: rem(0.75),
  },
  tags: {
    flexDirection: 'row',
    gap: rem(0.5),
  },
  chip: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    borderColor: '#E50914',
  },
  chipText: {
    color: '#fff',
  },
  sessions: {
    paddingHorizontal: rem(1),
    gap: rem(1),
    paddingBottom: rem(6),
  },
  sessionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: rem(0.75),
    padding: rem(1.25),
    gap: rem(0.75),
    borderWidth: 1,
    borderColor: '#333',
  },
  sessionCardPressed: {
    backgroundColor: '#2A2A2A',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: rem(2),
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.5,
  },
  price: {
    fontSize: rem(1),
    color: '#E50914',
    fontWeight: '500',
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.375),
    paddingBottom: rem(0.75),
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  room: {
    fontSize: rem(0.9375),
    color: '#E50914',
    fontWeight: '500',
  },
  seatTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.375),
    marginTop: rem(0.25),
  },
  seatTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
    paddingHorizontal: rem(0.625),
    paddingVertical: rem(0.375),
    borderRadius: rem(0.375),
  },
  seatTypeText: {
    fontSize: rem(0.8125),
    fontWeight: '500',
  },
  errorText: {
    color: '#fff',
    fontSize: rem(1.125),
    textAlign: 'center',
    marginBottom: rem(1),
  },
  modal: {
    backgroundColor: '#1a1a1a',
    margin: rem(1.25),
    padding: rem(1.25),
    borderRadius: rem(0.5),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
    marginBottom: rem(1),
  },
  modalTitle: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
    color: '#fff',
  },
  modalDescription: {
    fontSize: rem(1),
    color: '#ccc',
    marginBottom: rem(1),
  },
  modalBenefits: {
    gap: rem(0.5),
  },
  seatTypeIcon: {
    width: rem(3),
    height: rem(3),
    borderRadius: rem(1.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  benefitText: {
    fontSize: rem(0.875),
    color: '#999',
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: STATUS_BAR_HEIGHT + rem(3.75),
    left: rem(1.25),
    zIndex: 10,
    width: rem(2.75),
    height: rem(2.75),
    borderRadius: rem(0.875),
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  backButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rem(0.875),
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  backButtonPressed: {
    transform: [{ scale: 0.92 }],
  },
}); 