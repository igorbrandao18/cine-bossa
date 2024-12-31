import { PixelRatio } from 'react-native'

export const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16) 