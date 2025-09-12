import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { IStorageDetectionService } from '../interfaces/IStorageDetectionService';

/**
 * Service de détection des services de stockage disponibles
 * Responsabilité unique : Détecter la disponibilité des différents moyens de stockage
 */
export class StorageDetectionService implements IStorageDetectionService {
  /**
   * Vérifie si SecureStore est disponible sur la plateforme actuelle
   */
  async isSecureStoreAvailable(): Promise<boolean> {
    try {
      // SecureStore n'est pas disponible sur le web
      if (Platform.OS === 'web') {
        return false;
      }

      // Test de fonctionnement en écrivant et supprimant une valeur test
      const testKey = 'storage_detection_test';
      await SecureStore.setItemAsync(testKey, 'test');
      await SecureStore.deleteItemAsync(testKey);
      return true;
    } catch (error) {
      console.warn('⚠️  [StorageDetection] SecureStore non disponible:', error);
      return false;
    }
  }

  /**
   * Vérifie si AsyncStorage est disponible
   */
  async isAsyncStorageAvailable(): Promise<boolean> {
    try {
      // Test de fonctionnement en écrivant et supprimant une valeur test
      const testKey = 'async_storage_detection_test';
      await AsyncStorage.setItem(testKey, 'test');
      await AsyncStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('⚠️  [StorageDetection] AsyncStorage non disponible:', error);
      return false;
    }
  }
}
