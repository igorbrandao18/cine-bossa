import React from 'react'
import { StyleSheet } from 'react-native'
import { MotiView } from 'moti'
import { rem } from '@/shared/utils/dimensions'

export function SeatGlow() {
  return (
    <MotiView
      style={StyleSheet.absoluteFill}
      from={{
        opacity: 0.5,
        scale: 1,
      }}
      animate={{
        opacity: 0,
        scale: 1.5,
      }}
      transition={{
        loop: true,
        type: 'timing',
        duration: 1500,
        repeatReverse: false,
      }}
    >
      <MotiView style={styles.glow} />
    </MotiView>
  )
}

const styles = StyleSheet.create({
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E50914',
    borderRadius: rem(0.5),
    opacity: 0.3,
  },
}) 