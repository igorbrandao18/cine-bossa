import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Image, Pressable } from 'react-native';
import { Text, Button, Chip, Card, Divider, Portal, Modal } from 'react-native-paper';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSessionStore } from '../../stores/sessionStore';
import { useMovieStore } from '../../stores/movieStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { API_CONFIG, SIZES } from '../../config/api';
import { LinearGradient } from 'expo-linear-gradient';
import { SEAT_TYPES } from '../../types/seats';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function SessionsScreen() {
  const { movieId } = useLocalSearchParams();
  const router = useRouter();
  const { sessions, loading, error, loadSessions } = useSessionStore();
  const movie = useMovieStore(state => {
    const sections = state.sections;
    for (const section of Object.values(sections)) {
      const found = section.data.find(m => m.id === Number(movieId));
      if (found) return found;
    }
    return null;
  });

  const [selectedSeatType, setSelectedSeatType] = useState<keyof typeof SEAT_TYPES | null>(null);

  useEffect(() => {
    if (movieId) {
      loadSessions(Number(movieId));
    }
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
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
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerBackTitle: ' ',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={{ 
              uri: `${API_CONFIG.imageBaseUrl}/${SIZES.backdrop.large}${movie.backdrop_path}` 
            }}
            style={styles.backdrop}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', '#000']}
            style={StyleSheet.absoluteFill}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    height: 300,
    position: 'relative',
    marginBottom: 16,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  movieInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  overview: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    backgroundColor: 'rgba(229, 9, 20, 0.2)',
    borderColor: '#E50914',
  },
  chipText: {
    color: '#fff',
  },
  sessions: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sessionCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
    gap: 12,
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
    fontSize: 32,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 16,
    color: '#E50914',
    fontWeight: '500',
  },
  roomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  room: {
    fontSize: 15,
    color: '#E50914',
    fontWeight: '500',
  },
  seatTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  seatTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  seatTypeText: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalDescription: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 16,
  },
  modalBenefits: {
    gap: 8,
  },
  seatTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
    color: '#999',
    flex: 1,
  },
}); 