/**
 * Interface pour les services de chiffrement/déchiffrement
 * Responsabilité unique : Cryptographie des données sensibles
 */
export interface ICryptoService {
  /**
   * Chiffre une chaîne de caractères
   * @param plainText - Le texte en clair à chiffrer
   * @returns Le texte chiffré en base64
   * @throws Error si le texte est invalide
   */
  encrypt(plainText: string): string;

  /**
   * Déchiffre une chaîne de caractères
   * @param encryptedText - Le texte chiffré en base64
   * @returns Le texte en clair
   * @throws Error si le texte chiffré est invalide
   */
  decrypt(encryptedText: string): string;
}
