import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabSelectorProps {
  tabs: string[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
}

export function TabSelector({ tabs, selectedTab, onSelectTab }: TabSelectorProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          style={[
            styles.tab,
            selectedTab === tab && styles.selectedTab,
          ]}
          onPress={() => onSelectTab(tab)}
        >
          <Text style={[
            styles.tabText,
            selectedTab === tab && styles.selectedTabText,
          ]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    padding: 4,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedTab: {
    backgroundColor: '#E50914',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedTabText: {
    fontWeight: 'bold',
  },
}); 