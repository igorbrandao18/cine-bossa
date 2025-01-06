import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { Camera, CameraType } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import { rem } from '../../../core/theme/rem';

interface CardScannerProps {
  onScan: (cardData: {
    number?: string;
    expiryDate?: string;
    name?: string;
  }) => void;
  onClose: () => void;
}

export function CardScanner({ onScan, onClose }: CardScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setCameraReady] = useState(false);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleCameraReady = useCallback(() => {
    setCameraReady(true);
  }, []);

  const scanCard = async () => {
    if (!camera || !isCameraReady || isScanning) return;

    try {
      setIsScanning(true);

      // Captura a foto
      const photo = await camera.takePictureAsync({
        quality: 1,
        base64: true,
      });

      // Processa a imagem para melhorar o OCR
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { resize: { width: 1200 } },
          { contrast: 1.2 },
          { brightness: 1.1 },
        ],
        { base64: true }
      );

      // Simula o processamento OCR (em um app real, você usaria uma API de OCR)
      // Por exemplo: Google Cloud Vision API, AWS Textract, ou Tesseract
      setTimeout(() => {
        // Simula dados detectados
        onScan({
          number: '4111111111111111',
          expiryDate: '12/25',
          name: 'NOME DETECTADO',
        });
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erro ao escanear cartão:', error);
    } finally {
      setIsScanning(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sem acesso à câmera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={setCamera}
        style={styles.camera}
        type={CameraType.back}
        onCameraReady={handleCameraReady}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#fff" />
            </Pressable>
            <Text style={styles.title}>Escaneie seu cartão</Text>
          </View>

          <View style={styles.cardFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.instruction}>
              Posicione o cartão dentro da moldura
            </Text>
            <Pressable 
              onPress={scanCard}
              style={[styles.scanButton, isScanning && styles.scanningButton]}
              disabled={isScanning}
            >
              <MaterialCommunityIcons 
                name={isScanning ? "credit-card-scan" : "credit-card-plus"} 
                size={24} 
                color="#fff" 
              />
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Escaneando...' : 'Escanear Cartão'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: rem(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rem(2),
  },
  closeButton: {
    padding: rem(0.5),
  },
  title: {
    color: '#fff',
    fontSize: rem(1.25),
    fontWeight: '500',
    marginLeft: rem(1),
  },
  cardFrame: {
    flex: 1,
    marginVertical: rem(2),
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: rem(2),
    height: rem(2),
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#E50914',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: rem(2),
    height: rem(2),
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#E50914',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: rem(2),
    height: rem(2),
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#E50914',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: rem(2),
    height: rem(2),
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#E50914',
  },
  footer: {
    alignItems: 'center',
    gap: rem(1),
  },
  instruction: {
    color: '#fff',
    fontSize: rem(0.875),
    opacity: 0.8,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E50914',
    padding: rem(1),
    borderRadius: rem(0.5),
    gap: rem(0.5),
  },
  scanningButton: {
    opacity: 0.7,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: rem(1),
    fontWeight: '500',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
  },
}); 