/**
 * Service API pour les licences
 * Responsable de la communication avec l'API de licences
 */

import type { License } from '../types/License';
import config from '../config/api';

const API_BASE_URL = config.LICENSE_API_URL;

// Interface pour la réponse réelle de l'API (différente des types génériques)
interface LicenseApiResponse {
  dataStatus: 'success' | 'error';
  licenseCount: number;
  message: string;
  status: number;
  licenses: Array<{
    uuid: string;
    name: string;
    hasRecipeRoles: boolean;
    expired: boolean;
    // autres propriétés selon le besoin
  }>;
}

class LicenseApiError extends Error {
  code: string;
  details?: string;

  constructor(code: string, message: string, details?: string) {
    super(message);
    this.name = 'LicenseApiError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Service pour gérer les appels API de licences
 */
export class LicenseApiService {
  private static instance: LicenseApiService;

  private constructor() {}

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
    try {
      const url = API_BASE_URL + '/mine';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new LicenseApiError(
          'HTTP_ERROR',
          'Erreur lors de la récupération des licences',
          `${response.status} ${response.statusText}`
        );
      }

      const data = await response.json() as LicenseApiResponse;
      
      if (data.dataStatus !== 'success') {
        throw new LicenseApiError(
          'API_ERROR',
          'API License: ' + data.message,
          `Status: ${data.status}`
        );
      }

      return data.licenses as unknown as License[];
    } catch (error) {
      if (error instanceof LicenseApiError) {
        throw error;
      }
      
      throw new LicenseApiError(
        'NETWORK_ERROR',
        'Erreur réseau lors de la récupération des licences',
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
      
      // Chercher une licence avec les droits pour l'API recipe
      const recipeLicense = licenses.find(license => 
        license.api_roles['api-recipe'] && 
        license.api_roles['api-recipe'].roles.length > 0 &&
        license.exp > Math.floor(Date.now() / 1000) // Licence non expirée
      );

      if (recipeLicense) {
        console.log('✅ [LicenseAPI] Licence recipe trouvée:', {
          uuid: recipeLicense.uuid,
          name: recipeLicense.name,
          roles: recipeLicense.api_roles['api-recipe'].roles
        });
      } else {
        console.log('⚠️ [LicenseAPI] Aucune licence recipe valide trouvée');
      }

      return recipeLicense || null;
    } catch (error) {
      console.error('❌ [LicenseAPI] Erreur lors de la recherche de licence recipe:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur a une permission spécifique pour une API
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

// Instance singleton
export const licenseApiService = LicenseApiService.getInstance();
