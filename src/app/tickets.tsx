import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Pressable } from 'react-native';
import { Text, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';
import { Image } from 'expo-image';
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
} from 'react-native-reanimated';
import { useTicketStore } from '../features/tickets/stores/ticketStore';
import { Ticket } from '../features/tickets/types/ticket';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import QRCode from 'react-native-qrcode-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../core/theme/rem';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Header } from '../shared/components/Header';

const { width, height } = Dimensions.get('window');
const TICKET_HEIGHT = height * 0.65;
const TICKET_MARGIN = rem(1.25);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Tickets() {
  const theme = useTheme();
  const { tickets, loading, error, loadTickets } = useTicketStore();
  const scrollY = useSharedValue(0);
  const selectedTicket = useRef<Ticket | null>(null);
  const isExpanded = useSharedValue(0);

  useEffect(() => {
    loadTickets();
  }, []);

  const handleTicketPress = async (ticket: Ticket) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    selectedTicket.current = ticket;
    isExpanded.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isExpanded.value = withSpring(0);
  };

  const renderTicket = (ticket: Ticket, index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const scale = interpolate(
        isExpanded.value,
        [0, 1],
        [1, selectedTicket.current?.id === ticket.id ? 1 : 0.9],
        Extrapolate.CLAMP
      );

      const translateY = interpolate(
        isExpanded.value,
        [0, 1],
        [0, selectedTicket.current?.id === ticket.id ? -height * 0.1 : height * 0.1],
        Extrapolate.CLAMP
      );

      const opacity = interpolate(
        isExpanded.value,
        [0, 1],
        [1, selectedTicket.current?.id === ticket.id ? 1 : 0.3],
        Extrapolate.CLAMP
      );

      return {
        transform: [{ scale }, { translateY }],
        opacity,
      };
    });

    return (
      <AnimatedPressable
        key={ticket.id}
        style={[styles.ticketContainer, animatedStyle]}
        onPress={() => handleTicketPress(ticket)}
        entering={FadeInDown.delay(index * 100).springify()}
        exiting={FadeOutUp}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${ticket.posterPath}` }}
          style={styles.ticketImage}
          contentFit="cover"
          transition={300}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        />
        <BlurView intensity={20} style={styles.ticketContent}>
          <View style={styles.ticketHeader}>
            <Text style={styles.movieTitle}>{ticket.movieTitle}</Text>
            <View style={[styles.status, { backgroundColor: getStatusColor(ticket.status) }]}>
              <Text style={styles.statusText}>{getStatusText(ticket.status)}</Text>
            </View>
          </View>

          <View style={styles.ticketDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={20} color="#fff" />
              <Text style={styles.detailText}>
                {format(new Date(ticket.date), "dd 'de' MMMM", { locale: ptBR })}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="clock-outline" size={20} color="#fff" />
              <Text style={styles.detailText}>{ticket.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="theater" size={20} color="#fff" />
              <Text style={styles.detailText}>Sala {ticket.room}</Text>
            </View>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="seat" size={20} color="#fff" />
              <Text style={styles.detailText}>Assentos: {ticket.seats.join(', ')}</Text>
            </View>
          </View>

          {isExpanded.value === 1 && selectedTicket.current?.id === ticket.id && (
            <Animated.View 
              style={styles.qrContainer}
              entering={FadeInDown.delay(200)}
            >
              <QRCode
                value={ticket.qrCode}
                size={120}
                color="#fff"
                backgroundColor="transparent"
              />
            </Animated.View>
          )}
        </BlurView>
      </AnimatedPressable>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <MaterialCommunityIcons name="alert-circle" size={48} color="#FF453A" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style="light" />
      <Header
        title="Meus Ingressos"
        variant="transparent"
        alignment="center"
        rightAction={
          isExpanded.value === 1
            ? {
                icon: 'close',
                onPress: handleClose,
              }
            : undefined
        }
      />

      <SafeAreaView style={styles.content} edges={['bottom']}>
        {tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="ticket-outline" size={64} color="#666" />
            <Text style={styles.emptyText}>
              Você ainda não possui ingressos
            </Text>
          </View>
        ) : (
          <Animated.ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={isExpanded.value === 0}
          >
            {tickets.map((ticket, index) => renderTicket(ticket, index))}
          </Animated.ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const getStatusColor = (status: Ticket['status']) => {
  switch (status) {
    case 'valid':
      return '#4CAF50';
    case 'used':
      return '#9E9E9E';
    case 'expired':
      return '#FF453A';
    default:
      return '#9E9E9E';
  }
};

const getStatusText = (status: Ticket['status']) => {
  switch (status) {
    case 'valid':
      return 'Válido';
    case 'used':
      return 'Utilizado';
    case 'expired':
      return 'Expirado';
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: TICKET_MARGIN,
    gap: TICKET_MARGIN,
  },
  ticketContainer: {
    height: TICKET_HEIGHT,
    borderRadius: rem(1.5),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  ticketContent: {
    flex: 1,
    padding: rem(1.5),
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: rem(1),
  },
  movieTitle: {
    fontSize: rem(1.5),
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    marginRight: rem(1),
  },
  status: {
    paddingHorizontal: rem(0.75),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.5),
  },
  statusText: {
    color: '#fff',
    fontSize: rem(0.75),
    fontWeight: '600',
  },
  ticketDetails: {
    gap: rem(0.75),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  detailText: {
    color: '#fff',
    fontSize: rem(0.875),
    opacity: 0.9,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: rem(1.5),
    padding: rem(1),
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: rem(1),
    alignSelf: 'center',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF453A',
    marginTop: rem(1),
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: rem(1),
  },
  emptyText: {
    color: '#666',
    fontSize: rem(1),
    textAlign: 'center',
  },
}); 