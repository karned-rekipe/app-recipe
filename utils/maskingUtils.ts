/**
 * Utilitaires pour le masquage des données sensibles dans les logs
 * Responsabilité unique : Masquer les informations sensibles pour la sécurité des logs
 */

/**
 * Masque un token pour l'affichage sécurisé dans les logs
 * @param token - Le token à masquer
 * @returns Le token masqué avec seulement le début et la fin visibles
 */
export function maskToken(token: string): string {
  if (!token || typeof token !== 'string') {
    return '***';
  }
  
  if (token.length <= 20) {
    return '***';
  }
  
  return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
}

/**
 * Masque un email pour l'affichage sécurisé dans les logs
 * @param email - L'email à masquer
 * @returns L'email masqué (ex: jo***@ex***.com)
 */
export function maskEmail(email: string): string {
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return '***';
  }
  
  const [username, domain] = email.split('@');
  
  if (username.length <= 2) {
    return `***@${domain}`;
  }
  
  const maskedUsername = username.charAt(0) + '***' + username.slice(-1);
  const maskedDomain = domain.charAt(0) + '***' + domain.slice(-3);
  
  return `${maskedUsername}@${maskedDomain}`;
}

/**
 * Masque une chaîne générique pour l'affichage sécurisé
 * @param value - La valeur à masquer
 * @param visibleChars - Nombre de caractères visibles au début et à la fin (défaut: 3)
 * @returns La valeur masquée
 */
export function maskString(value: string, visibleChars: number = 3): string {
  if (!value || typeof value !== 'string') {
    return '***';
  }
  
  if (value.length <= visibleChars * 2) {
    return '***';
  }
  
  return `${value.substring(0, visibleChars)}...${value.substring(value.length - visibleChars)}`;
}
