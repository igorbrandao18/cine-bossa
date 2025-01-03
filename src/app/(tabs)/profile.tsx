import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rem } from '../../core/theme/rem';
import { PaymentMethodsList } from '../../features/profile/components/PaymentMethodsList';

export default function ProfileScreen() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={rem(3)} color="#fff" />
        </View>
        <Text style={styles.name}>João Silva</Text>
        <Text style={styles.email}>joao.silva@email.com</Text>
      </View>

      <View style={styles.section}>
        <PaymentMethodsList />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="cog" size={rem(1.5)} color="#E50914" />
          <Text style={styles.sectionTitle}>Configurações</Text>
        </View>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="bell-outline" size={rem(1.5)} color="#fff" />
            <Text style={styles.settingText}>Notificações</Text>
            <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
          </View>

          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="shield-outline" size={rem(1.5)} color="#fff" />
            <Text style={styles.settingText}>Privacidade</Text>
            <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
          </View>

          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="help-circle-outline" size={rem(1.5)} color="#fff" />
            <Text style={styles.settingText}>Ajuda</Text>
            <MaterialCommunityIcons name="chevron-right" size={rem(1.5)} color="#666" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: rem(1.25),
    gap: rem(2),
  },
  header: {
    alignItems: 'center',
    gap: rem(0.75),
    marginBottom: rem(2),
  },
  avatar: {
    width: rem(6),
    height: rem(6),
    borderRadius: rem(3),
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: rem(1.25),
    color: '#fff',
    fontWeight: '500',
  },
  email: {
    fontSize: rem(0.875),
    color: '#666',
  },
  section: {
    backgroundColor: '#1a1a1a',
    borderRadius: rem(1),
    padding: rem(1.25),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.75),
    marginBottom: rem(1),
  },
  sectionTitle: {
    fontSize: rem(1.125),
    color: '#fff',
    fontWeight: '500',
  },
  settingsList: {
    gap: rem(1),
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(1),
    paddingVertical: rem(0.75),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingText: {
    flex: 1,
    fontSize: rem(1),
    color: '#fff',
  },
}); 