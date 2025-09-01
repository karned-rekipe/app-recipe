/**
 * Configuration de l'API
 * 
 * Configuration pour l'environnement de test local :
 * - Auth URL: http://localhost:9001/auth/v1
 * - License URL: http://localhost:9003/license/v1
 * - Utilisateur de test: user1@example.com
 * - Mot de passe de test: password
 * - Documentation Swagger: http://localhost:9001/docs
 * 
 * Routes disponibles :
 * - POST /token : pour obtenir un token d'accès (JSON: {username, password})
 * - POST /renew : pour renouveler le token avec le refresh token (JSON: {refresh_token})
 * - GET /mine : pour récupérer les licences de l'utilisateur
 * 
 * Format des requêtes : JSON (Content-Type: application/json)
 */

const config = {
  // URL de base pour l'authentification
  AUTH_API_URL: 'http://localhost:9001/auth/v1',
  
  // URL de base pour les licences
  LICENSE_API_URL: 'http://localhost:9003/license/v1',
  
  // Endpoints d'authentification
  auth: {
    token: '/token',
    refresh: '/renew', // Endpoint séparé pour le refresh
    userInfo: '/me', // À confirmer si disponible
  },
  
  // Endpoints des licences
  license: {
    mine: '/mine', // Récupérer les licences de l'utilisateur connecté
  },
  
  // Configuration des tokens
  token: {
    // Marge de sécurité avant expiration (en millisecondes)
    expirationMargin: 5 * 60 * 1000, // 5 minutes
  },
  
  // Configuration du chiffrement
  encryption: {
    simpleKey: 'rekipe-secure-key-2024'
  }
} as const;

export default config;
