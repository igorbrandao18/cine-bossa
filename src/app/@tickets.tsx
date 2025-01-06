import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text, useTheme, ActivityIndicator } from 'react-native-paper';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
  withTiming,
  withSequence,
  withDelay,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useMovieStore } from '@/features/movies/stores/movieStore';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '@/core/theme/rem';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { colors } from '@/core/theme/colors';
import { MotiView } from 'moti';
import { Image } from 'expo-image';
import { API_CONFIG, SIZES } from '@/core/config/api';
import { getStatusBarHeight, getTopPosition } from '@/shared/utils/statusbar';

const PLACEHOLDER_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';
const DEFAULT_POSTER = '/wwemzKWzjKYJFfCeiB57q3r4Bcm.png';

const { width, height } = Dimensions.get('window');
const TICKET_HEIGHT = height * 0.38;
const TICKET_MARGIN = rem(1);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TicketStatus = 'VALID' | 'USED' | 'EXPIRED';

interface Ticket {
  id: string;
  movieId: string;
  movieTitle: string;
  posterPath: string;
  date: string;
  time: string;
  room: string;
  technology: string;
  seats: string[];
  price: number;
  status?: TicketStatus;
}

interface TicketItemProps {
  ticket: Ticket;
  index: number;
  onPress: () => void;
}

const TICKET_STATUS = {
  VALID: {
    label: 'Válido',
    color: '#4CAF50',
    icon: 'check-circle',
    bgColor: 'rgba(76, 175, 80, 0.1)',
  },
  USED: {
    label: 'Utilizado',
    color: '#2196F3',
    icon: 'check-circle-outline',
    bgColor: 'rgba(33, 150, 243, 0.1)',
  },
  EXPIRED: {
    label: 'Expirado',
    color: '#FF5722',
    icon: 'clock-outline',
    bgColor: 'rgba(255, 87, 34, 0.1)',
  },
} as const;

const TicketItem = React.memo(({ ticket, index, onPress }: TicketItemProps) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const formatDate = useCallback((dateString: string) => {
    try {
      const [day, month, year] = dateString.split('/').map(Number);
      const date = new Date(year, month - 1, day);
      
      if (isNaN(date.getTime())) {
        console.error('Data inválida:', dateString);
        return dateString;
      }

      return format(date, "dd 'de' MMMM", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error, dateString);
      return dateString;
    }
  }, []);

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    rotation.value = withSequence(
      withTiming(-2, { duration: 100 }),
      withTiming(2, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ]
  }));

  const imageUrl = !ticket.posterPath
    ? `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w500}${DEFAULT_POSTER}`
    : ticket.posterPath.startsWith('http')
      ? ticket.posterPath
      : `${API_CONFIG.imageBaseUrl}/${SIZES.poster.w500}${ticket.posterPath}`;

  return (
    <AnimatedPressable
      style={[styles.ticketContainer, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={SlideInRight.delay(index * 100).springify()}
      layout={Layout.springify()}
    >
      <Image 
        source={{ uri: imageUrl }}
        style={styles.backgroundImage}
        blurRadius={10}
        contentFit="cover"
        cachePolicy="memory-disk"
        placeholder={PLACEHOLDER_BLURHASH}
      />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
        style={styles.overlay}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      <View style={styles.ticketContent}>
        <View style={styles.ticketHeader}>
          <Image 
            source={{ uri: imageUrl }}
            style={styles.moviePoster}
            contentFit="cover"
            cachePolicy="memory-disk"
            placeholder={PLACEHOLDER_BLURHASH}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {ticket.movieTitle}
            </Text>
            <View style={styles.dateTimeContainer}>
              <View style={styles.infoTag}>
                <MaterialCommunityIcons name="calendar" size={16} color={colors.primary} />
                <Text style={styles.infoText}>{formatDate(ticket.date)}</Text>
              </View>
              <View style={styles.infoTag}>
                <MaterialCommunityIcons name="clock-outline" size={16} color={colors.primary} />
                <Text style={styles.infoText}>{ticket.time}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.dividerContainer}>
          <View style={styles.circleLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.circleRight} />
        </View>

        <View style={styles.ticketDetails}>
          <View style={styles.detailsRow}>
            <View style={styles.detailItem}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="theater" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Sala</Text>
                <Text style={styles.detailValue}>{ticket.room}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons name="seat" size={20} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Assentos</Text>
                <Text style={styles.detailValue}>{ticket.seats.join(', ')}</Text>
              </View>
            </View>
          </View>

          <View style={styles.ticketFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Total</Text>
              <Text style={styles.priceValue}>R$ {ticket.price.toFixed(2)}</Text>
            </View>

            <View style={[
              styles.statusTag,
              { backgroundColor: TICKET_STATUS[ticket.status || 'VALID'].bgColor }
            ]}>
              <MaterialCommunityIcons 
                name={TICKET_STATUS[ticket.status || 'VALID'].icon as any}
                size={16}
                color={TICKET_STATUS[ticket.status || 'VALID'].color}
              />
              <Text style={[
                styles.statusText,
                { color: TICKET_STATUS[ticket.status || 'VALID'].color }
              ]}>
                {TICKET_STATUS[ticket.status || 'VALID'].label}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
});

export default function TicketsScreen() {
  const { tickets, loading, error, loadTickets, clearTickets } = useTicketStore();
  const { sections, loadNowPlaying, loadPopular, loadUpcoming, loadTopRated } = useMovieStore();

  useEffect(() => {
    const init = async () => {
      await clearTickets();
      await loadTickets();
      loadNowPlaying();
      loadPopular();
      loadUpcoming();
      loadTopRated();
    };

    init();
  }, []);

  const handleTicketPress = useCallback((ticket: Ticket) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Aqui você pode adicionar a navegação para os detalhes do ingresso
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <MaterialCommunityIcons 
          name="ticket-outline" 
          size={64} 
          color={colors.textSecondary} 
        />
        <Text style={styles.emptyText}>
          Você ainda não tem ingressos.{'\n'}
          Compre ingressos para seus filmes favoritos!
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Ingressos</Text>
        <Text style={styles.headerSubtitle}>
          {tickets.length} {tickets.length === 1 ? 'ingresso' : 'ingressos'}
        </Text>
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {tickets.map((ticket, index) => (
          <TicketItem
            key={`ticket-${ticket.id}-${index}`}
            ticket={ticket}
            index={index}
            onPress={() => handleTicketPress(ticket)}
          />
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: rem(1.5),
    paddingVertical: rem(1),
  },
  headerTitle: {
    fontSize: rem(2),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: rem(0.25),
  },
  headerSubtitle: {
    fontSize: rem(1),
    color: colors.textSecondary,
  },
  scrollContent: {
    padding: TICKET_MARGIN,
    gap: TICKET_MARGIN,
  },
  ticketContainer: {
    height: TICKET_HEIGHT,
    borderRadius: rem(1.5),
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: rem(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: rem(1.5),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ticketContent: {
    flex: 1,
    padding: rem(1.25),
  },
  ticketHeader: {
    flexDirection: 'row',
    gap: rem(1),
    marginBottom: rem(1),
  },
  moviePoster: {
    width: rem(5),
    height: rem(7.5),
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerInfo: {
    flex: 1,
    marginLeft: rem(1),
  },
  movieTitle: {
    fontSize: rem(1.125),
    lineHeight: rem(1.375),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: rem(0.75),
    textShadowColor: 'rgba(0,0,0,0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: rem(0.5),
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: rem(0.25),
    paddingHorizontal: rem(0.5),
    borderRadius: rem(0.5),
    gap: rem(0.25),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  infoText: {
    fontSize: rem(0.75),
    color: colors.textSecondary,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: rem(0.75),
    position: 'relative',
  },
  circleLeft: {
    width: rem(1.5),
    height: rem(1.5),
    borderRadius: rem(0.75),
    backgroundColor: colors.background,
    position: 'absolute',
    left: -rem(0.75),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  circleRight: {
    width: rem(1.5),
    height: rem(1.5),
    borderRadius: rem(0.75),
    backgroundColor: colors.background,
    position: 'absolute',
    right: -rem(0.75),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dashedLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  ticketDetails: {
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: rem(0.75),
    gap: rem(0.75),
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: rem(0.625),
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconWrapper: {
    width: rem(2),
    height: rem(2),
    borderRadius: rem(1),
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.2)',
  },
  detailLabel: {
    fontSize: rem(0.625),
    color: colors.textSecondary,
    opacity: 0.8,
  },
  detailValue: {
    fontSize: rem(0.75),
    color: colors.text,
    fontWeight: '500',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: rem(0.75),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  priceContainer: {
    alignItems: 'flex-start',
    backgroundColor: 'rgba(229, 9, 20, 0.1)',
    padding: rem(0.625),
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: 'rgba(229, 9, 20, 0.2)',
  },
  priceLabel: {
    fontSize: rem(0.625),
    color: colors.textSecondary,
    opacity: 0.8,
  },
  priceValue: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
    color: colors.primary,
    textShadowColor: 'rgba(229, 9, 20, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: rem(0.25),
    paddingHorizontal: rem(0.625),
    borderRadius: rem(0.5),
    gap: rem(0.375),
  },
  statusText: {
    fontSize: rem(0.75),
    fontWeight: '600',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    marginTop: rem(1),
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: rem(1.5),
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: rem(1.125),
    textAlign: 'center',
    maxWidth: '80%',
  },
}); 