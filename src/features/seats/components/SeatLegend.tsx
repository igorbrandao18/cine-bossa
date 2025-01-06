import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function SeatLegend() {
  return (
    <View style={styles.container}>
      <View style={styles.legendItem}>
        <MaterialCommunityIcons name="seat" size={24} color="#666" />
        <Text style={styles.legendText}>Disponível</Text>
      </View>
      <View style={styles.legendItem}>
        <MaterialCommunityIcons name="seat" size={24} color="#E50914" />
        <Text style={styles.legendText}>Selecionado</Text>
      </View>
      <View style={styles.legendItem}>
        <MaterialCommunityIcons name="seat" size={24} color="#333" />
        <Text style={styles.legendText}>Ocupado</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#1a1a1a',
    marginHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
  },
}); 