import { View, Text, StyleSheet } from 'react-native';
import { Modal, Portal, Button } from 'react-native-paper';
import type { Seat } from '../types/seat';

interface ConfirmationModalProps {
  visible: boolean;
  selectedSeats: Seat[];
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ConfirmationModal({
  visible,
  selectedSeats,
  onConfirm,
  onDismiss
}: ConfirmationModalProps) {
  const total = selectedSeats.length * 25; // Preço fixo por assento

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Confirmar Seleção</Text>
        
        <View style={styles.content}>
          <Text style={styles.subtitle}>Assentos Selecionados:</Text>
          {selectedSeats.map((seat) => (
            <Text key={seat.id} style={styles.seatInfo}>
              Fileira {seat.row} - Assento {seat.column}
            </Text>
          ))}
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            textColor="#fff"
            style={styles.button}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={onConfirm}
            buttonColor="#E50914"
            style={styles.button}
          >
            Confirmar
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  content: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  seatInfo: {
    color: '#ccc',
    marginBottom: 4,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    fontSize: 16,
    color: '#fff',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    minWidth: 100,
  },
}); 