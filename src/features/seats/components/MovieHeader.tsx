import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme, rem } from '@/theme';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHeaderHeight } from '@react-navigation/elements';
import { HeaderBackButton } from '@/shared/components/HeaderBackButton';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSessionStore } from '@/features/sessions/stores/sessionStore';
import { useEffect } from 'react';

interface MovieHeaderProps {
  sessionId: string;
}

export function MovieHeader({ sessionId }: MovieHeaderProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { currentSession, setCurrentSession, sessions } = useSessionStore();

  useEffect(() => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
    return () => setCurrentSession(null);
  }, [sessionId, sessions]);

  if (!currentSession) return null;

  const formattedDate = format(
    new Date(currentSession.date),
    "EEEE, d 'de' MMMM", 
    { locale: ptBR }
  );

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          paddingTop: insets.top,
          height: headerHeight + insets.top,
          backgroundColor: theme.colors.surface,
        }
      ]}
    >
      <View style={styles.content}>
        <HeaderBackButton />
        
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSession.movieTitle}
          </Text>
          
          <View style={styles.details}>
            <MaterialCommunityIcons 
              name="calendar" 
              size={rem(1)} 
              color={theme.colors.textSecondary} 
            />
            <Text style={styles.date}>
              {formattedDate}
            </Text>
            <Text style={styles.separator}>•</Text>
            <MaterialCommunityIcons 
              name="clock-outline" 
              size={rem(1)} 
              color={theme.colors.textSecondary} 
            />
            <Text style={styles.time}>
              {currentSession.time}
            </Text>
            <Text style={styles.separator}>•</Text>
            <MaterialCommunityIcons 
              name="theater" 
              size={rem(1)} 
              color={theme.colors.textSecondary} 
            />
            <Text style={styles.room}>
              Sala {currentSession.room}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: rem(1),
  },
  info: {
    flex: 1,
    marginLeft: rem(1),
  },
  title: {
    fontSize: rem(1.25),
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: rem(0.25),
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: rem(0.5),
  },
  date: {
    fontSize: rem(0.875),
    color: theme.colors.textSecondary,
  },
  separator: {
    fontSize: rem(0.875),
    color: theme.colors.textSecondary,
  },
  time: {
    fontSize: rem(0.875),
    color: theme.colors.textSecondary,
  },
  room: {
    fontSize: rem(0.875),
    color: theme.colors.textSecondary,
  },
}); 