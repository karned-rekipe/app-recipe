import type { ICryptoService } from '../interfaces/ICryptoService';

/**
 * Service de chiffrement simple utilisant XOR + Base64
 * Responsabilité unique : Chiffrement et déchiffrement des données sensibles
 * 
 * Note: Ce service utilise un chiffrement simple pour la compatibilité.
 * Pour un environnement de production, considérez l'utilisation d'un chiffrement plus robuste.
 */
export class SimpleCryptoService implements ICryptoService {
  private readonly encryptionKey = 'rekipe2024';

  /**
   * Chiffre une chaîne de caractères avec XOR + Base64
   */
  encrypt(plainText: string): string {
    if (!plainText || typeof plainText !== 'string') {
      throw new Error('CryptoService: le texte à chiffrer doit être une chaîne de caractères non vide');
    }

    let encrypted = '';
    for (let i = 0; i < plainText.length; i++) {
      encrypted += String.fromCharCode(
        plainText.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
      );
    }

    try {
      return btoa(encrypted);
    } catch (error) {
      throw new Error(`CryptoService: Erreur lors de l'encodage Base64: ${error}`);
    }
  }

  /**
   * Déchiffre une chaîne de caractères Base64 + XOR
   */
  decrypt(encryptedText: string): string {
    if (!encryptedText || typeof encryptedText !== 'string') {
      throw new Error('CryptoService: le texte chiffré doit être une chaîne de caractères non vide');
    }

    let decrypted = '';
    try {
      const encrypted = atob(encryptedText);
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
          encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length)
        );
      }
      return decrypted;
    } catch (error) {
      throw new Error(`CryptoService: Erreur lors du décodage Base64: ${error}`);
    }
  }
}
