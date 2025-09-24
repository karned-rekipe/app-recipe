/**
 * Service API pour les licences - Refactorisé selon le principe SRP
 * Chaque classe a une responsabilité unique et bien définie
 */

import type { License } from '../types/License';
import config from '../config/api';

const API_BASE_URL = config.LICENSE_API_URL;

// ===== TYPES ET INTERFACES =====

interface LicenseApiResponse {
  dataStatus?: 'success' | 'error';
  licenseCount?: number;
  message: string;
  status: number | string;
  licenses?: Array<{
    uuid: string;
    name: string;
    hasRecipeRoles: boolean;
    expired: boolean;
  }>;
  data?: Array<any>;
}

// ===== GESTION DES ERREURS =====

export class LicenseApiError extends Error {
  readonly code: string;
  readonly details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'LicenseApiError';
    this.code = code;
    this.details = details;
  }
}

// ===== VALIDATION =====

/**
 * Responsable de la validation des données d'entrée
 */
class LicenseValidator {
  /**
   * Valide qu'un token d'accès est valide
   */
  validateAccessToken(token: string): void {
    if (!token || typeof token !== 'string' || !token.trim()) {
      throw new LicenseApiError(
        'INVALID_TOKEN',
        'Token d\'accès invalide ou manquant',
        'Le token doit être une chaîne de caractères non vide'
      );
    }
  }

  /**
   * Valide qu'une licence n'est pas expirée
   */
  isLicenseValid(license: License): boolean {
    return license.exp > Math.floor(Date.now() / 1000);
  }
}

// ===== CLIENT HTTP =====

/**
 * Responsable uniquement des appels HTTP vers l'API de licences
 */
class LicenseHttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Effectue un appel GET vers l'endpoint /mine
   */
  async fetchUserLicenses(token: string): Promise<LicenseApiResponse> {
    const url = `${this.baseUrl}/mine`;
    
    console.log('🚀 [LicenseHttpClient] Appel vers:', url);
    console.log('🚀 [LicenseHttpClient] Token:', this.maskToken(token));
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 [LicenseHttpClient] Réponse HTTP:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });

      if (!response.ok) {
        await this.handleHttpError(response);
      }

      return await response.json();
    } catch (error) {
      this.handleNetworkError(error);
    }
  }

  private maskToken(token: string): string {
    if (token.length <= 20) return '***';
    return `${token.substring(0, 10)}...${token.substring(token.length - 10)}`;
  }

  private async handleHttpError(response: Response): Promise<never> {
    let errorDetails = `${response.status} ${response.statusText}`;
    
    try {
      const errorBody = await response.text();
      console.error('❌ [LicenseHttpClient] Corps de l\'erreur:', errorBody);
      errorDetails += ` - ${errorBody}`;
    } catch (e) {
      console.error('❌ [LicenseHttpClient] Impossible de lire le corps de l\'erreur');
    }
    
    throw new LicenseApiError(
      'HTTP_ERROR',
      'Erreur lors de la récupération des licences',
      errorDetails
    );
  }

  private handleNetworkError(error: unknown): never {
    console.error('❌ [LicenseHttpClient] Erreur réseau:', error);
    
    throw new LicenseApiError(
      'NETWORK_ERROR',
      'Erreur réseau lors de la récupération des licences',
      error instanceof Error ? error.message : 'Erreur inconnue'
    );
  }
}

// ===== PARSING DES RÉPONSES =====

/**
 * Responsable du parsing et de la transformation des réponses API
 */
class LicenseResponseParser {
  /**
   * Parse la réponse de l'API et extrait les licences
   */
  parseLicensesResponse(response: LicenseApiResponse): License[] {
    console.log('🔍 [LicenseResponseParser] Parsing de la réponse:', {
      dataStatus: response.dataStatus,
      message: response.message,
      status: response.status,
      licenseCount: response.licenseCount,
      hasLicenses: !!response.licenses,
      hasData: !!response.data,
    });

    this.validateResponseStatus(response);
    return this.extractLicenses(response);
  }

  private validateResponseStatus(response: LicenseApiResponse): void {
    const isSuccess = response.status === "success";
    
    if (!isSuccess) {
      throw new LicenseApiError(
        'API_ERROR',
        `API License: ${response.message}`,
        `Status: ${response.status}, DataStatus: ${response.dataStatus}`
      );
    }
  }

  private extractLicenses(response: LicenseApiResponse): License[] {
    let licenses: any[] = [];
    
    if (Array.isArray(response.data)) {
      licenses = response.data;
    } else {
      console.warn('⚠️ [LicenseResponseParser] Format de licences inattendu, création d\'un tableau vide');
      licenses = [];
    }

    console.log('✅ [LicenseResponseParser] Licences extraites:', {
      count: licenses.length,
      licenses: licenses.map(l => ({ 
        uuid: l.uuid?.substring(0, 8) + '...', 
        name: l.name 
      }))
    });

    return licenses as License[];
  }
}

// ===== VÉRIFICATION DES PERMISSIONS =====

/**
 * Responsable de la vérification des permissions et des rôles des licences
 */
class LicensePermissionChecker {
  /**
   * Trouve la première licence valide pour une API donnée
   */
  findValidLicenseForApi(licenses: License[], apiName: string): License | null {
    const validLicense = licenses.find(license => 
      this.hasApiAccess(license, apiName) && 
      this.isLicenseNotExpired(license)
    );

    if (validLicense) {
      console.log(`✅ [LicensePermissionChecker] Licence ${apiName} trouvée:`, {
        uuid: validLicense.uuid,
        name: validLicense.name,
        roles: this.getApiPermissions(validLicense, apiName)
      });
    } else {
      console.log(`⚠️ [LicensePermissionChecker] Aucune licence ${apiName} valide trouvée`);
    }

    return validLicense || null;
  }

  /**
   * Vérifie si une licence a accès à une API
   */
  hasApiAccess(license: License, apiName: string): boolean {
    const apiRoles = license.api_roles[apiName];
    return apiRoles && apiRoles.roles.length > 0;
  }

  /**
   * Vérifie si une licence n'est pas expirée
   */
  isLicenseNotExpired(license: License): boolean {
    return license.exp > Math.floor(Date.now() / 1000);
  }

  /**
   * Vérifie si une licence a une permission spécifique pour une API
   */
  hasApiPermission(license: License, apiName: string, permission: string): boolean {
    const apiRoles = license.api_roles[apiName];
    return apiRoles ? apiRoles.roles.includes(permission) : false;
  }

  /**
   * Récupère toutes les permissions d'une licence pour une API donnée
   */
  getApiPermissions(license: License, apiName: string): string[] {
    const apiRoles = license.api_roles[apiName];
    return apiRoles ? apiRoles.roles : [];
  }
}

// ===== SERVICE PRINCIPAL =====

/**
 * Service principal orchestrateur pour la gestion des licences
 * Coordonne les différents composants selon le principe SRP
 */
export class LicenseApiService {
  private static instance: LicenseApiService;
  
  private readonly validator: LicenseValidator;
  private readonly httpClient: LicenseHttpClient;
  private readonly responseParser: LicenseResponseParser;
  private readonly permissionChecker: LicensePermissionChecker;

  private constructor() {
    this.validator = new LicenseValidator();
    this.httpClient = new LicenseHttpClient();
    this.responseParser = new LicenseResponseParser();
    this.permissionChecker = new LicensePermissionChecker();
  }

  public static getInstance(): LicenseApiService {
    if (!LicenseApiService.instance) {
      LicenseApiService.instance = new LicenseApiService();
    }
    return LicenseApiService.instance;
  }

  /**
   * Récupère les licences de l'utilisateur connecté
   */
  async getUserLicenses(token: string): Promise<License[]> {
    console.log('� [LicenseApiService] Début de getUserLicenses');
    
    try {
      // 1. Validation des données d'entrée
      this.validator.validateAccessToken(token);
      
      // 2. Appel HTTP
      const response = await this.httpClient.fetchUserLicenses(token);
      
      // 3. Parsing de la réponse
      const licenses = this.responseParser.parseLicensesResponse(response);
      
      console.log('✅ [LicenseApiService] Licences récupérées avec succès:', licenses.length);
      return licenses;
      
    } catch (error) {
      console.error('❌ [LicenseApiService] Erreur lors de la récupération des licences:', error);
      
      // Re-lancer les erreurs métier, wrapper les autres
      if (error instanceof LicenseApiError) {
        throw error;
      }
      
      throw new LicenseApiError(
        'UNEXPECTED_ERROR',
        'Erreur inattendue lors de la récupération des licences',
        error instanceof Error ? error.message : 'Erreur inconnue'
      );
    }
  }

  /**
   * Trouve la première licence valide pour les recettes
   */
  async getRecipeLicense(accessToken: string): Promise<License | null> {
    try {
      const licenses = await this.getUserLicenses(accessToken);
      return this.permissionChecker.findValidLicenseForApi(licenses, 'api-recipe');
    } catch (error) {
      console.error('❌ [LicenseApiService] Erreur lors de la recherche de licence recipe:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique pour une API
   */
  hasApiPermission(license: License, apiName: string, permission: string): boolean {
    return this.permissionChecker.hasApiPermission(license, apiName, permission);
  }

  /**
   * Récupère toutes les permissions d'une licence pour une API donnée
   */
  getApiPermissions(license: License, apiName: string): string[] {
    return this.permissionChecker.getApiPermissions(license, apiName);
  }

  /**
   * Vérifie si une licence est valide (non expirée)
   */
  isLicenseValid(license: License): boolean {
    return this.validator.isLicenseValid(license);
  }
}

// Instance singleton
export const licenseApiService = LicenseApiService.getInstance();
