import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SEAT_TYPES } from '../types/seats';

export function SeatTypes() {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Tipos de Assentos</Text>
      <View style={styles.legend}>
        {Object.entries(SEAT_TYPES).map(([key, value]) => (
          <View key={key} style={styles.legendItem}>
            <LinearGradient
              colors={[value.color, value.color + '80']}
              style={styles.legendIcon}
            >
              <MaterialCommunityIcons 
                name={value.icon} 
                size={12} 
                color="#fff" 
              />
            </LinearGradient>
            <Text style={styles.legendText}>{value.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendText: {
    color: '#999',
    fontSize: 12,
  },
}); 