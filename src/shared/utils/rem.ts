import { PixelRatio } from 'react-native';

/**
 * Converte um valor em REM para pixels
 * @param value Valor em REM (1rem = 16px)
 * @returns Valor em pixels
 */
export const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16); 