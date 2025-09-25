import Constants from 'expo-constants';

export type Environment = 'development' | 'production';

interface EnvironmentConfig {
  AUTH_API_URL: string;
  LICENSE_API_URL: string;
  RECIPE_API_URL: string;
}

const environments: Record<Environment, EnvironmentConfig> = {
  development: {
    AUTH_API_URL: 'http://localhost:9000/auth/v1/',
    LICENSE_API_URL: 'http://localhost:9000/license/v1/',
    RECIPE_API_URL: 'http://localhost:9000/recipe/v1/',
  },
  production: {
    AUTH_API_URL: 'https://api.karned.bzh/auth/v1/',
    LICENSE_API_URL: 'https://api.karned.bzh/license/v1/',
    RECIPE_API_URL: 'https://api.karned.bzh/recipe/v1/',
  },
};

// Détermine l'environnement actuel
export const getCurrentEnvironment = (): Environment => {
  // En mode développement Expo
  if (__DEV__) {
    return 'development';
  }

  // Vérification basée sur le mode de release d'Expo
  if (Constants.executionEnvironment === 'standalone') {
    return 'production';
  }

  // Par défaut, utilise l'environnement de développement
  return 'development';
};

// Récupère la configuration pour l'environnement actuel
export const getEnvironmentConfig = (): EnvironmentConfig => {
  const currentEnv = getCurrentEnvironment();
  return environments[currentEnv];
};
