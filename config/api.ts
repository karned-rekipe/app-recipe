import { getEnvironmentConfig } from './environments';

const environmentConfig = getEnvironmentConfig();

const config = {
  // URL de base pour l'authentification
  AUTH_API_URL: environmentConfig.AUTH_API_URL,

  // URL de base pour les licences
  LICENSE_API_URL: environmentConfig.LICENSE_API_URL,

  // URL de base pour les recettes
  RECIPE_API_URL: environmentConfig.RECIPE_API_URL,

  // Endpoints d'authentification
  auth: {
    token: 'token',
    refresh: 'renew', // Endpoint séparé pour le refresh
  },
  
  // Endpoints des licences
  license: {
    mine: 'mine', // Récupérer les licences de l'utilisateur connecté
  },
  
  // Endpoints des recettes
  recipe: {
    list: '', // Récupérer la liste des recettes
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
