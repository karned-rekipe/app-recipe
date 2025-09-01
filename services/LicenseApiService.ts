/**
 * Service API pour les licences
 * Responsable de la communication avec l'API de licences
 */

import type { LicenseResponse, LicenseError, License } from '../types/License';
import config from '../config/api';

const API_BASE_URL = config.LICENSE_API_URL;

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
  async getUserLicenses(accessToken: string): Promise<License[]> {
    try {
      console.log('🔍 [LicenseAPI] Récupération des licences utilisateur...');
      
      const response = await fetch(`${API_BASE_URL}${config.license.mine}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data: LicenseResponse = await response.json();
      
      console.log('🔍 [LicenseAPI] Réponse de l\'API licences:', { 
        status: response.status,
        dataStatus: data.status,
        licenseCount: data.data?.length || 0
      });

      if (!response.ok) {
        throw new LicenseApiError(
          'LICENSE_API_ERROR',
          data.message || 'Erreur lors de la récupération des licences',
          JSON.stringify(data)
        );
      }

      if (data.status !== 'success') {
        throw new LicenseApiError(
          'LICENSE_ERROR',
          data.message || 'Erreur dans la réponse de l\'API licences'
        );
      }

      console.log('✅ [LicenseAPI] Licences récupérées avec succès:', {
        count: data.data.length,
        licenses: data.data.map(license => ({
          uuid: license.uuid,
          name: license.name,
          hasRecipeRoles: !!license.api_roles['api-recipe']
        }))
      });

      return data.data;
    } catch (error) {
      if (error instanceof LicenseApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new LicenseApiError(
          'NETWORK_ERROR',
          'Impossible de contacter le serveur de licences. Vérifiez votre connexion.'
        );
      }

      console.error('❌ [LicenseAPI] Erreur inattendue:', error);
      throw new LicenseApiError(
        'UNKNOWN_ERROR',
        'Une erreur inattendue s\'est produite lors de la récupération des licences',
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
