import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { rem } from '../core/theme/rem';
import { CustomFooter } from '../components/CustomFooter';
import { useMovieStore } from '../features/movies/stores/movieStore';
import type { Movie } from '../features/movies/types/movie';

interface UserStats {
  moviesWatched: number;
  points: number;
  activeCoupons: number;
  favoriteGenres: { id: number; name: string }[];
  level: {
    current: number;
    title: string;
    progress: number;
    nextLevel: string;
  };
}

interface UpcomingTicket {
  movie: Movie;
  date: string;
  time: string;
  room: string;
  seats: string[];
}

interface WatchedMovie {
  movie: Movie;
  date: string;
  rating: number;
}

const USER_STATS: UserStats = {
  moviesWatched: 48,
  points: 2450,
  activeCoupons: 3,
  favoriteGenres: [
    { id: 28, name: 'Ação' },
    { id: 878, name: 'Ficção científica' },
    { id: 18, name: 'Drama' },
  ],
  level: {
    current: 42,
    title: 'Cinéfilo Premium',
    progress: 75,
    nextLevel: 'Cinéfilo Elite',
  },
};

export default function ProfileScreen() {
  const { 
    sections: { nowPlaying, upcoming },
    genres,
    loadGenres,
    loadNowPlaying,
    loadUpcoming,
  } = useMovieStore();

  const [upcomingTickets, setUpcomingTickets] = useState<UpcomingTicket[]>([]);
  const [watchHistory, setWatchHistory] = useState<WatchedMovie[]>([]);

  useEffect(() => {
    loadGenres();
    loadNowPlaying();
    loadUpcoming();
  }, []);

  useEffect(() => {
    if (upcoming.movies.length > 0) {
      // Simula ingressos comprados com filmes reais do upcoming
      const tickets: UpcomingTicket[] = upcoming.movies.slice(0, 3).map((movie, index) => ({
        movie,
        date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        }),
        time: ['19:30', '15:00', '21:00'][index],
        room: ['Sala IMAX', 'Sala VIP', 'Sala 3'][index],
        seats: [['F12', 'F13'], ['H5', 'H6', 'H7'], ['D8', 'D9']][index],
      }));
      setUpcomingTickets(tickets);
    }
  }, [upcoming.movies]);

  useEffect(() => {
    if (nowPlaying.movies.length > 0) {
      // Simula histórico com filmes reais do nowPlaying
      const history: WatchedMovie[] = nowPlaying.movies.slice(0, 5).map((movie, index) => ({
        movie,
        date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        }),
        rating: Math.floor(Math.random() * 3) + 3, // Rating entre 3 e 5
      }));
      setWatchHistory(history);
    }
  }, [nowPlaying.movies]);

  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map(id => genres.find(g => g.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header com foto e informações do perfil */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/300?img=1' }}
                style={styles.avatar}
              />
              <Pressable style={styles.editAvatarButton}>
                <MaterialCommunityIcons name="pencil" size={rem(1.25)} color="#fff" />
              </Pressable>
            </View>
            <Text style={styles.profileName}>João Silva</Text>
            <View style={styles.levelContainer}>
              <MaterialCommunityIcons name="crown" size={rem(1.25)} color="#FFD700" />
              <Text style={styles.levelText}>Nível {USER_STATS.level.current}</Text>
              <Text style={styles.levelTitle}>{USER_STATS.level.title}</Text>
            </View>
            <View style={styles.levelProgress}>
              <View style={[styles.levelProgressFill, { width: `${USER_STATS.level.progress}%` }]} />
            </View>
            <Text style={styles.levelInfo}>
              {USER_STATS.level.progress}% para {USER_STATS.level.nextLevel}
            </Text>
          </View>
        </View>

        {/* Seção de Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="ticket-confirmation" size={rem(1.5)} color="#E50914" />
            <Text style={styles.statValue}>{USER_STATS.moviesWatched}</Text>
            <Text style={styles.statLabel}>Filmes Assistidos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="popcorn" size={rem(1.5)} color="#E50914" />
            <Text style={styles.statValue}>{USER_STATS.points}</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="ticket-percent" size={rem(1.5)} color="#E50914" />
            <Text style={styles.statValue}>{USER_STATS.activeCoupons}</Text>
            <Text style={styles.statLabel}>Cupons Ativos</Text>
          </View>
        </View>

        {/* Seção Próximas Sessões */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximas Sessões</Text>
            <Pressable style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver Todos</Text>
              <MaterialCommunityIcons name="chevron-right" size={rem(1.25)} color="#E50914" />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieList}>
            {upcomingTickets.map(ticket => (
              <Pressable key={ticket.movie.id} style={styles.ticketCard}>
                <Image 
                  source={{ 
                    uri: `https://image.tmdb.org/t/p/w500${ticket.movie.poster_path}` 
                  }} 
                  style={styles.moviePoster} 
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.ticketGradient}
                >
                  <Text style={styles.movieTitle}>{ticket.movie.title}</Text>
                  <Text style={styles.movieGenres}>
                    {getGenreNames(ticket.movie.genre_ids)}
                  </Text>
                  <View style={styles.ticketInfo}>
                    <View style={styles.ticketDetail}>
                      <MaterialCommunityIcons name="calendar" size={rem(0.875)} color="#fff" />
                      <Text style={styles.ticketText}>{ticket.date}</Text>
                    </View>
                    <View style={styles.ticketDetail}>
                      <MaterialCommunityIcons name="clock-outline" size={rem(0.875)} color="#fff" />
                      <Text style={styles.ticketText}>{ticket.time}</Text>
                    </View>
                  </View>
                  <View style={styles.ticketInfo}>
                    <View style={styles.ticketDetail}>
                      <MaterialCommunityIcons name="theater" size={rem(0.875)} color="#fff" />
                      <Text style={styles.ticketText}>{ticket.room}</Text>
                    </View>
                    <View style={styles.ticketDetail}>
                      <MaterialCommunityIcons name="seat" size={rem(0.875)} color="#fff" />
                      <Text style={styles.ticketText}>{ticket.seats.join(', ')}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Seção Histórico */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Histórico</Text>
            <Pressable style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Ver Todos</Text>
              <MaterialCommunityIcons name="chevron-right" size={rem(1.25)} color="#E50914" />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieList}>
            {watchHistory.map(item => (
              <View key={item.movie.id} style={styles.historyCard}>
                <Image 
                  source={{ 
                    uri: `https://image.tmdb.org/t/p/w500${item.movie.poster_path}` 
                  }} 
                  style={styles.moviePoster} 
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.movieGradient}
                >
                  <Text style={styles.movieTitle}>{item.movie.title}</Text>
                  <Text style={styles.movieGenres}>
                    {getGenreNames(item.movie.genre_ids)}
                  </Text>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <MaterialCommunityIcons
                        key={star}
                        name={star <= item.rating ? 'star' : 'star-outline'}
                        size={rem(1)}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                  <Text style={styles.movieDate}>{item.date}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Seção de Gêneros Favoritos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus Gêneros Favoritos</Text>
          <View style={styles.genresGrid}>
            {USER_STATS.favoriteGenres.map(genre => (
              <View key={genre.id} style={styles.genreItem}>
                <Text style={styles.genreLabel}>{genre.name}</Text>
                <View style={styles.genreBar}>
                  <View style={[styles.genreBarFill, { width: `${Math.random() * 40 + 60}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Configurações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.settingsList}>
            <Pressable style={styles.settingItem}>
              <MaterialCommunityIcons name="account-edit" size={rem(1.5)} color="#fff" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Editar Perfil</Text>
                <Text style={styles.settingDescription}>Nome, foto e preferências</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
            </Pressable>
            <Pressable style={styles.settingItem}>
              <MaterialCommunityIcons name="credit-card" size={rem(1.5)} color="#fff" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Formas de Pagamento</Text>
                <Text style={styles.settingDescription}>Cartões e outros métodos</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
            </Pressable>
            <Pressable style={styles.settingItem}>
              <MaterialCommunityIcons name="ticket-percent" size={rem(1.5)} color="#fff" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Cupons e Promoções</Text>
                <Text style={styles.settingDescription}>Descontos disponíveis</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
            </Pressable>
            <Pressable style={styles.settingItem}>
              <MaterialCommunityIcons name="bell-outline" size={rem(1.5)} color="#fff" />
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>Notificações</Text>
                <Text style={styles.settingDescription}>Lançamentos e promoções</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
            </Pressable>
          </View>
        </View>

        {/* Botão de Logout */}
        <Pressable style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={rem(1.5)} color="#E50914" />
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>
      <CustomFooter />
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
  },
  header: {
    paddingTop: rem(4),
    paddingBottom: rem(2),
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: rem(1),
  },
  avatar: {
    width: rem(8),
    height: rem(8),
    borderRadius: rem(4),
    borderWidth: 2,
    borderColor: '#E50914',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#E50914',
    width: rem(2.5),
    height: rem(2.5),
    borderRadius: rem(1.25),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  profileName: {
    fontSize: rem(1.5),
    color: '#fff',
    fontWeight: '600',
    marginBottom: rem(0.5),
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
    marginBottom: rem(0.5),
  },
  levelText: {
    color: '#FFD700',
    fontSize: rem(1),
    fontWeight: '600',
  },
  levelTitle: {
    color: '#FFD700',
    fontSize: rem(0.875),
    fontWeight: '500',
  },
  levelProgress: {
    width: '80%',
    height: rem(0.375),
    backgroundColor: '#333',
    borderRadius: rem(0.1875),
    marginBottom: rem(0.25),
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: rem(0.1875),
  },
  levelInfo: {
    fontSize: rem(0.75),
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: rem(2),
    marginHorizontal: rem(2),
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: rem(4),
    backgroundColor: '#333',
  },
  statValue: {
    fontSize: rem(1.25),
    color: '#fff',
    fontWeight: '600',
    marginVertical: rem(0.5),
  },
  statLabel: {
    fontSize: rem(0.75),
    color: '#666',
    textAlign: 'center',
  },
  section: {
    padding: rem(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(1),
  },
  sectionTitle: {
    fontSize: rem(1.25),
    color: '#fff',
    fontWeight: '600',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  seeAllText: {
    color: '#E50914',
    fontSize: rem(0.875),
  },
  movieList: {
    marginHorizontal: rem(-2),
    paddingHorizontal: rem(2),
  },
  ticketCard: {
    width: rem(12),
    marginRight: rem(1),
    borderRadius: rem(0.5),
    overflow: 'hidden',
    position: 'relative',
  },
  historyCard: {
    width: rem(9),
    marginRight: rem(1),
    borderRadius: rem(0.5),
    overflow: 'hidden',
    position: 'relative',
  },
  moviePoster: {
    width: '100%',
    height: rem(13.5),
    backgroundColor: '#1a1a1a',
  },
  ticketGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: rem(1),
    paddingTop: rem(3),
  },
  movieGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: rem(0.75),
    paddingTop: rem(2),
  },
  movieTitle: {
    color: '#fff',
    fontSize: rem(0.875),
    fontWeight: '500',
    marginBottom: rem(0.25),
  },
  movieGenres: {
    color: '#999',
    fontSize: rem(0.75),
    marginBottom: rem(0.5),
  },
  ticketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: rem(0.5),
  },
  ticketDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  ticketText: {
    color: '#fff',
    fontSize: rem(0.75),
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: rem(0.25),
    marginBottom: rem(0.25),
  },
  movieDate: {
    color: '#666',
    fontSize: rem(0.75),
  },
  genresGrid: {
    gap: rem(1),
  },
  genreItem: {
    marginBottom: rem(1),
  },
  genreLabel: {
    color: '#fff',
    fontSize: rem(0.875),
    marginBottom: rem(0.5),
  },
  genreBar: {
    height: rem(0.5),
    backgroundColor: '#333',
    borderRadius: rem(0.25),
    overflow: 'hidden',
  },
  genreBarFill: {
    height: '100%',
    backgroundColor: '#E50914',
    borderRadius: rem(0.25),
  },
  settingsList: {
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: rem(1),
    gap: rem(1),
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    color: '#fff',
    fontSize: rem(1),
  },
  settingDescription: {
    color: '#666',
    fontSize: rem(0.75),
    marginTop: rem(0.25),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: rem(1),
    padding: rem(1.5),
    marginTop: rem(2),
    marginBottom: rem(4),
  },
  logoutText: {
    color: '#E50914',
    fontSize: rem(1),
  },
}); 