import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rem } from '../../core/theme/rem';

interface HeaderProps {
  title: string;
  subtitle?: string;
  details?: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    text: string;
  }[];
  onBack?: () => void;
  variant?: 'transparent' | 'filled';
}

export function Header({ 
  title, 
  subtitle, 
  details,
  onBack,
  variant = 'transparent'
}: HeaderProps) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <View style={[
      styles.container, 
      styles[variant],
      { paddingTop: insets.top }
    ]}>
      <View style={styles.content}>
        <IconButton
          icon="arrow-left"
          iconColor="#fff"
          size={24}
          onPress={handleBack}
          style={styles.backButton}
        />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          
          {(subtitle || details) && (
            <View style={styles.detailsContainer}>
              {subtitle && (
                <Text style={styles.subtitle}>{subtitle}</Text>
              )}
              
              {details && (
                <View style={styles.details}>
                  {details.map((detail, index) => (
                    <View key={index} style={styles.detailItem}>
                      {index > 0 && (
                        <Text style={styles.separator}>•</Text>
                      )}
                      <MaterialCommunityIcons 
                        name={detail.icon}
                        size={rem(1)}
                        color="#999"
                      />
                      <Text style={styles.detailText}>
                        {detail.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  transparent: {
    backgroundColor: 'transparent',
  },
  filled: {
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: rem(3.5),
    paddingHorizontal: rem(0.5),
  },
  backButton: {
    margin: 0,
  },
  info: {
    flex: 1,
    marginLeft: rem(0.5),
  },
  title: {
    fontSize: rem(1.25),
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: rem(0.875),
    color: '#999',
    marginTop: rem(0.25),
  },
  detailsContainer: {
    marginTop: rem(0.25),
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: rem(0.5),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.25),
  },
  detailText: {
    fontSize: rem(0.875),
    color: '#999',
  },
  separator: {
    color: '#666',
    marginHorizontal: rem(0.25),
  },
}); 