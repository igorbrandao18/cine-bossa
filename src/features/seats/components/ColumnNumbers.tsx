import { View, Text, StyleSheet } from 'react-native';

interface ColumnNumbersProps {
  columns: number;
}

export function ColumnNumbers({ columns }: ColumnNumbersProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: columns }).map((_, index) => (
        <View key={index} style={styles.column}>
          <Text style={styles.number}>{index + 1}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  column: {
    width: 32,
    alignItems: 'center',
  },
  number: {
    color: '#666',
    fontSize: 12,
  },
}); 