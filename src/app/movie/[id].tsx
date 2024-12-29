import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Button, Title, Paragraph, Chip, Portal, Modal } from 'react-native-paper';
import { useMovies } from '../../hooks/useMovies';
import { MovieDetails } from '../../types/tmdb';
import { IMAGE_BASE_URL, POSTER_SIZES } from '../../config/api';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { getMovieDetails, loading } = useMovies();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadMovieDetails();
  }, [id]);

  const loadMovieDetails = async () => {
    const data = await getMovieDetails(Number(id));
    if (data) {
      setMovie(data);
    }
  };

  const handleBuyTicket = () => {
    router.push(`/sessions/${id}`);
  };

  if (!movie) return null;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ 
          uri: `${IMAGE_BASE_URL}/${POSTER_SIZES.original}${movie.backdrop_path}` 
        }}
        style={styles.backdrop}
      />
      <View style={styles.content}>
        <Title style={styles.title}>{movie.title}</Title>
        <View style={styles.genreContainer}>
          {movie.genres.map(genre => (
            <Chip key={genre.id} style={styles.genre}>
              {genre.name}
            </Chip>
          ))}
        </View>
        <Paragraph style={styles.overview}>{movie.overview}</Paragraph>
        <View style={styles.infoRow}>
          <Chip icon="clock" style={styles.info}>
            {`${movie.runtime} min`}
          </Chip>
          <Chip icon="star" style={styles.info}>
            {movie.vote_average.toFixed(1)}
          </Chip>
        </View>
        <Button 
          mode="contained" 
          onPress={handleBuyTicket}
          style={styles.button}
        >
          Comprar Ingresso
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  genre: {
    margin: 4,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  info: {
    marginRight: 8,
  },
  button: {
    marginTop: 16,
  },
}); 