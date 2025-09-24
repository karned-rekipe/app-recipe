/**
 * Index des services - Architecture refactorisée selon le SRP
 */

// Services principaux (tous refactorisés selon le SRP)
export { secureStorageService } from './SecureStorageService';
export { authenticatedApiService } from './AuthenticatedApiService';
export { recipeApiService, RecipeApiService } from './RecipeApiService';
export { AuthApiService, authApiService } from './AuthApiService';
export { LicenseApiService, licenseApiService } from './LicenseApiService';

// Erreurs personnalisées
export { AuthApiError } from './AuthApiService';
export { LicenseApiError } from './LicenseApiService';
export { AuthenticatedApiError } from './AuthenticatedApiService';
export { RecipeApiError } from './RecipeApiService';
export { StorageError } from './SecureStorageService';

// Types et interfaces
export type { 
  AuthTokens, 
  AuthResponse, 
  LoginCredentials 
} from '../types/Auth';

export type { 
  License 
} from '../types/License';

export type { 
  Recipe 
} from '../types/Recipe';
