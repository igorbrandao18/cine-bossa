import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { Session } from '@/features/sessions/types/session';
import { styles } from './styles/purchase-summary.styles';

interface PurchaseSummaryProps {
  currentSession: Session;
  selectedSeats: string[];
  getTotalPrice: () => number;
}

export function PurchaseSummary({ currentSession, selectedSeats, getTotalPrice }: PurchaseSummaryProps) {
  return (
    <View style={styles.summary}>
      <View style={styles.summaryContent}>
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle}>{currentSession.movieTitle}</Text>
          <View style={styles.sessionDetails}>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.sessionDetailsText}>{currentSession.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.sessionDetailsText}>{currentSession.time}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="door" size={16} color={colors.textSecondary} />
              <Text style={styles.sessionDetailsText}>{currentSession.room}</Text>
            </View>
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="video" size={16} color={colors.textSecondary} />
              <Text style={styles.sessionDetailsText}>{currentSession.technology}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.seatsInfo}>
          <Text style={styles.seatsLabel}>Assentos selecionados</Text>
          <View style={styles.seatsGrid}>
            {selectedSeats.map(seatId => {
              const seat = currentSession.seats.find(s => s.id === seatId);
              if (!seat) return null;
              
              return (
                <View key={seatId} style={styles.seatCard}>
                  <View style={styles.seatBadge}>
                    <Text style={styles.seatText}>
                      {seat.row}{seat.number}
                    </Text>
                  </View>
                  <Text style={styles.seatType}>
                    {seat.type === 'couple' ? 'Namorados' :
                     seat.type === 'premium' ? 'Premium' :
                     seat.type === 'wheelchair' ? 'Acessível' :
                     seat.type === 'companion' ? 'Acompanhante' : 'Padrão'}
                  </Text>
                  <Text style={styles.seatPrice}>
                    R$ {seat.price.toFixed(2)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.priceBreakdown}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Ingressos ({selectedSeats.length}x)</Text>
            <Text style={styles.priceValue}>R$ {getTotalPrice().toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxa de conveniência</Text>
            <Text style={styles.priceValue}>R$ {(getTotalPrice() * 0.1).toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R$ {(getTotalPrice() * 1.1).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
} 