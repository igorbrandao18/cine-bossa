import { Platform, StatusBar, Dimensions } from 'react-native';

export function getStatusBarHeight(): number {
  if (Platform.OS === 'ios') {
    // iOS status bar height is generally 44pt on devices with notch, 20pt on older devices
    return Platform.select({
      ios: Platform.isPad ? 20 : 44,
      default: 0,
    });
  }

  // For Android, we can use StatusBar.currentHeight
  return StatusBar.currentHeight || 0;
}

export function getTopPosition(): number {
  const screenHeight = Dimensions.get('window').height;
  const statusBarHeight = getStatusBarHeight();
  return (screenHeight * 0.05) + statusBarHeight; // 5% da altura da tela + altura da status bar
} 