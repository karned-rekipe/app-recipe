/**
 * Service API pour la gestion des recettes - Refactorisé selon le SRP
 * Architecture modulaire avec responsabilités séparées
 */

import config from '../config/api';
import type { AuthTokens } from '../types/Auth';
import type { License } from '../types/License';
import type { Recipe } from '../types/Recipe';
import { maskToken } from '../utils/maskingUtils';

// ==================== TYPES ET INTERFACES ====================

export interface RecipeApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  error?: string;
}

export interface RecipeRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

// ==================== GESTION DES ERREURS ====================

export class RecipeApiError extends Error {
  readonly code: string;
  readonly details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'RecipeApiError';
    this.code = code;
    this.details = details;
  }
}

// ==================== VALIDATION ====================

/**
 * Responsable de la validation des données d'entrée pour les requêtes recettes
 */
class RecipeValidator {
  /**
   * Valide les tokens d'authentification
   */
  validateTokens(tokens: AuthTokens): void {
    if (!tokens?.access_token || typeof tokens.access_token !== 'string') {
      throw new RecipeApiError(
        'INVALID_TOKENS',
        'Token d\'accès invalide ou manquant pour l\'API recettes'
      );
    }
  }

  /**
   * Valide la licence pour l'accès aux recettes
   */
  validateLicense(license: License): void {
    if (!license?.uuid || typeof license.uuid !== 'string') {
      throw new RecipeApiError(
        'INVALID_LICENSE',
        'Licence invalide ou manquante pour l\'accès aux recettes'
      );
    }

    if (license.exp && license.exp < Math.floor(Date.now() / 1000)) {
      throw new RecipeApiError(
        'EXPIRED_LICENSE',
        'La licence pour l\'accès aux recettes a expiré'
      );
    }
  }

  /**
   * Valide une recette avant envoi
   */
  validateRecipe(recipe: Partial<Recipe>): void {
    if (!recipe.name || typeof recipe.name !== 'string' || !recipe.name.trim()) {
      throw new RecipeApiError(
        'INVALID_RECIPE',
        'Le nom de la recette est requis'
      );
    }
  }

  /**
   * Valide les données de réponse de l'API
   */
  validateResponseData(data: any): void {
    if (!Array.isArray(data)) {
      throw new RecipeApiError(
        'INVALID_RESPONSE',
        'Format de données invalide: tableau de recettes attendu',
        `Type reçu: ${typeof data}`
      );
    }
  }
}

// ==================== CONSTRUCTION DES HEADERS ====================

/**
 * Responsable de la construction des headers pour l'API recettes
 */
class RecipeHeadersBuilder {
  /**
   * Construit les headers pour les requêtes recettes
   */
  buildHeaders(tokens: AuthTokens, license: License, customHeaders: Record<string, string> = {}): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokens.access_token}`,
      'X-License-Key': license.uuid,
      ...customHeaders,
    };
  }
}

// ==================== LOGGING ====================

/**
 * Responsable des logs spécialisés pour l'API recettes
 */
class RecipeLogger {
  static logRequest(method: string, url: string, tokens: AuthTokens, license: License): void {
    console.log(`🍳 [RecipeAPI] ${method} ${url}`, {
      hasAuth: !!tokens.access_token,
      accessToken: maskToken(tokens.access_token),
      licenseUuid: license.uuid.substring(0, 8) + '...',
      licenseName: license.name
    });
  }

  static logSuccessfulResponse(count?: number): void {
    console.log('✅ [RecipeAPI] Recettes récupérées avec succès:', {
      count: count || 'Format inattendu'
    });
  }

  static logResponseFormat(data: any): void {
    console.warn('⚠️  [RecipeAPI] Format de réponse inattendu, attendu un tableau:', {
      type: typeof data,
      isArray: Array.isArray(data),
      length: Array.isArray(data) ? data.length : 'N/A'
    });
  }

  static logHttpError(status: number, statusText: string, data: any): void {
    console.error('❌ [RecipeAPI] Erreur HTTP lors de la récupération des recettes:', {
      status,
      statusText,
      error: data?.message || data?.detail,
      data
    });
  }

  static logNetworkError(error: unknown): void {
    console.error('🌐 [RecipeAPI] Erreur réseau lors de la récupération des recettes:', {
      error: error instanceof Error ? error.message : String(error),
      type: error instanceof Error ? error.constructor.name : typeof error
    });
  }
}

// ==================== CLIENT HTTP ====================

/**
 * Responsable des appels HTTP vers l'API recettes
 */
class RecipeHttpClient {
  /**
   * Effectue une requête GET vers l'API recettes
   */
  async get(url: string, headers: Record<string, string>): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const responseData = await response.json();

    if (!response.ok) {
      RecipeLogger.logHttpError(response.status, response.statusText, responseData);
      throw new RecipeApiError(
        'HTTP_ERROR',
        responseData?.message || responseData?.detail || `Erreur HTTP ${response.status}`,
        `Status: ${response.status} ${response.statusText}`
      );
    }

    return responseData;
  }

  /**
   * Effectue une requête POST vers l'API recettes
   */
  async post(url: string, headers: Record<string, string>, body: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const responseData = await response.json();

    if (!response.ok) {
      RecipeLogger.logHttpError(response.status, response.statusText, responseData);
      throw new RecipeApiError(
        'HTTP_ERROR',
        responseData?.message || responseData?.detail || `Erreur HTTP ${response.status}`,
        `Status: ${response.status} ${response.statusText}`
      );
    }

    return responseData;
  }
}

// ==================== TRANSFORMATION DES DONNÉES ====================

/**
 * Responsable de la transformation des réponses de l'API recettes
 */
class RecipeDataTransformer {
  /**
   * Transforme la réponse brute en réponse typée
   */
  transformGetRecipesResponse(data: any): RecipeApiResponse<Recipe[]> {
    return {
      status: 'success',
      data: data as Recipe[],
      message: `${data.length} recette(s) récupérée(s)`
    };
  }

  /**
   * Transforme une erreur en réponse d'erreur typée
   */
  transformErrorResponse(error: RecipeApiError): RecipeApiResponse<Recipe[]> {
    return {
      status: 'error',
      error: error.message,
      message: error.details || 'Erreur lors de l\'opération sur les recettes'
    };
  }

  /**
   * Transforme une erreur réseau en réponse d'erreur
   */
  transformNetworkErrorResponse(): RecipeApiResponse<Recipe[]> {
    return {
      status: 'error',
      error: 'Erreur de connexion au service des recettes',
      message: 'Vérifiez votre connexion internet'
    };
  }
}

// ==================== SERVICE PRINCIPAL ====================

/**
 * Service principal pour l'API des recettes
 * Coordonne les différents composants selon le principe SRP
 */
class RecipeApiService {
  private static instance: RecipeApiService;

  private readonly validator: RecipeValidator;
  private readonly headersBuilder: RecipeHeadersBuilder;
  private readonly httpClient: RecipeHttpClient;
  private readonly dataTransformer: RecipeDataTransformer;

  private constructor() {
    this.validator = new RecipeValidator();
    this.headersBuilder = new RecipeHeadersBuilder();
    this.httpClient = new RecipeHttpClient();
    this.dataTransformer = new RecipeDataTransformer();
  }

  public static getInstance(): RecipeApiService {
    if (!RecipeApiService.instance) {
      RecipeApiService.instance = new RecipeApiService();
    }
    return RecipeApiService.instance;
  }

  /**
   * Récupère la liste des recettes
   */
  async getRecipes(
    tokens: AuthTokens,
    license: License
  ): Promise<RecipeApiResponse<Recipe[]>> {
    try {
      // 1. Validation des données d'entrée
      this.validator.validateTokens(tokens);
      this.validator.validateLicense(license);

      // 2. Construction de l'URL et des headers
      const url = `${config.RECIPE_API_URL}${config.recipe.list}`;
      const headers = this.headersBuilder.buildHeaders(tokens, license);

      // 3. Log de la requête
      RecipeLogger.logRequest('GET', url, tokens, license);

      // 4. Exécution de la requête
      const responseData = await this.httpClient.get(url, headers);

      // 5. Validation des données de réponse
      this.validator.validateResponseData(responseData);

      // 6. Log du succès et transformation
      RecipeLogger.logSuccessfulResponse(responseData.length);
      return this.dataTransformer.transformGetRecipesResponse(responseData);

    } catch (error) {
      if (error instanceof RecipeApiError) {
        return this.dataTransformer.transformErrorResponse(error);
      }

      // Erreur réseau ou autre
      RecipeLogger.logNetworkError(error);
      return this.dataTransformer.transformNetworkErrorResponse();
    }
  }

  /**
   * Ajoute une nouvelle recette
   */
  async addRecipe(
    tokens: AuthTokens,
    license: License,
    recipe: Partial<Recipe>
  ): Promise<RecipeApiResponse<Recipe>> {
    try {
      // 1. Validation des données d'entrée
      this.validator.validateTokens(tokens);
      this.validator.validateLicense(license);
      this.validator.validateRecipe(recipe);

      // 2. Construction de l'URL et des headers
      const url = `${config.RECIPE_API_URL}/recipes`;
      const headers = this.headersBuilder.buildHeaders(tokens, license);

      // 3. Log de la requête
      RecipeLogger.logRequest('POST', url, tokens, license);

      // 4. Exécution de la requête
      const responseData = await this.httpClient.post(url, headers, recipe);

      return {
        status: 'success',
        data: responseData as Recipe,
        message: 'Recette ajoutée avec succès'
      };

    } catch (error) {
      if (error instanceof RecipeApiError) {
        return {
          status: 'error',
          error: error.message,
          message: error.details || 'Erreur lors de l\'ajout de la recette'
        };
      }

      RecipeLogger.logNetworkError(error);
      return {
        status: 'error',
        error: 'Erreur de connexion au service des recettes',
        message: 'Impossible d\'ajouter la recette'
      };
    }
  }
}

// Instance singleton exportée
export const recipeApiService = RecipeApiService.getInstance();

export { RecipeApiService };
