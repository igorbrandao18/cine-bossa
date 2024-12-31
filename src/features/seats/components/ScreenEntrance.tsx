import React from 'react'
import { StyleSheet, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withDelay,
  useSharedValue, 
  withTiming,
  Easing,
  runOnJS
} from 'react-native-reanimated'
import { rem } from '@/shared/utils/dimensions'

const { width } = Dimensions.get('window')

export function ScreenEntrance({ onAnimationComplete }: { onAnimationComplete: () => void }) {
  const leftCurtain = useSharedValue(0)
  const rightCurtain = useSharedValue(0)
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    const animateCurtains = () => {
      leftCurtain.value = withSequence(
        withSpring(-width / 2, { damping: 12 }),
        withDelay(100, withSpring(-width, { damping: 15 }))
      )
      
      rightCurtain.value = withSequence(
        withSpring(width / 2, { damping: 12 }),
        withDelay(100, withSpring(width, { damping: 15 }))
      )

      opacity.value = withDelay(
        800,
        withTiming(0, { 
          duration: 300,
          easing: Easing.out(Easing.ease)
        }, () => {
          runOnJS(onAnimationComplete)()
        })
      )
    }

    const timeout = setTimeout(animateCurtains, 500)
    return () => clearTimeout(timeout)
  }, [])

  const leftCurtainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftCurtain.value }]
  }))

  const rightCurtainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightCurtain.value }]
  }))

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.curtain, styles.leftCurtain, leftCurtainStyle]}>
        <LinearGradient
          colors={['#E50914', '#831010']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.curtain, styles.rightCurtain, rightCurtainStyle]}>
        <LinearGradient
          colors={['#831010', '#E50914']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1000,
  },
  curtain: {
    width: width / 2,
    height: '100%',
  },
  leftCurtain: {
    left: 0,
  },
  rightCurtain: {
    right: 0,
  },
  gradient: {
    flex: 1,
  }
}) 