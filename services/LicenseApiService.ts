/**
 * Service API pour les licences
 * Responsable de la communication avec l'API de licences
 */

import type { License } from '../types/License';
import config from '../config/api';

const API_BASE_URL = config.LICENSE_API_URL;

// Interface pour la réponse réelle de l'API (différente des types génériques)
interface LicenseApiResponse {
  dataStatus?: 'success' | 'error';
  licenseCount?: number;
  message: string;
  status: number | string; // Peut être number ou string selon l'API
  licenses?: Array<{
    uuid: string;
    name: string;
    hasRecipeRoles: boolean;
    expired: boolean;
    // autres propriétés selon le besoin
  }>;
  // L'API peut retourner directement un tableau de licences
  data?: Array<any>;
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
    console.log('🚀 [LicenseAPI] Début de getUserLicenses');
    
    // Validation du token
    if (!token || typeof token !== 'string' || !token.trim()) {
      throw new LicenseApiError(
        'INVALID_TOKEN',
        'Token d\'accès invalide ou manquant',
        'Le token doit être une chaîne de caractères non vide'
      );
    }
    
    console.log('🚀 [LicenseAPI] URL:', API_BASE_URL + '/mine');
    console.log('🚀 [LicenseAPI] Token:', token.substring(0, 20) + '...');
    
    try {
      const url = API_BASE_URL + '/mine';
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 [LicenseAPI] Réponse HTTP reçue:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        console.error('❌ [LicenseAPI] Erreur HTTP:', response.status, response.statusText);
        
        // Essayer de lire le corps de l'erreur
        try {
          const errorBody = await response.text();
          console.error('❌ [LicenseAPI] Corps de l\'erreur:', errorBody);
        } catch (e) {
          console.error('❌ [LicenseAPI] Impossible de lire le corps de l\'erreur');
        }
        
        throw new LicenseApiError(
          'HTTP_ERROR',
          'Erreur lors de la récupération des licences',
          `${response.status} ${response.statusText}`
        );
      }

      const data = await response.json() as LicenseApiResponse;
      
      console.log('🔍 [LicenseAPI] Réponse complète reçue:', JSON.stringify(data, null, 2));
      
      console.log('🔍 [LicenseAPI] Réponse reçue:', {
        dataStatus: data.dataStatus,
        message: data.message,
        status: data.status,
        licenseCount: data.licenseCount,
        hasLicenses: !!data.licenses,
        hasData: !!data.data,
        isArray: Array.isArray(data)
      });
      
      // Accepter plusieurs formats de statut de succès
      const isSuccess = data.dataStatus === 'success' || 
                       data.status === 200 || 
                       data.status === 'success' ||
                       data.message === 'Operation completed successfully' ||
                       data.message?.toLowerCase().includes('success');
      
      if (!isSuccess) {
        throw new LicenseApiError(
          'API_ERROR',
          'API License: ' + data.message,
          `Status: ${data.status}, DataStatus: ${data.dataStatus}`
        );
      }

      // Vérifier que nous avons bien des licences - essayer plusieurs formats
      let licenses: any[] = [];
      
      if (Array.isArray(data.licenses)) {
        licenses = data.licenses;
      } else if (Array.isArray(data.data)) {
        licenses = data.data;
      } else if (Array.isArray(data)) {
        // L'API peut retourner directement un tableau
        licenses = data as any[];
      } else {
        console.warn('⚠️ [LicenseAPI] Format de licences inattendu, création d\'un tableau vide');
        licenses = [];
      }

      console.log('✅ [LicenseAPI] Licences parsées:', {
        count: licenses.length,
        licenses: licenses.map(l => ({ uuid: l.uuid?.substring(0, 8) + '...', name: l.name }))
      });

      return licenses as unknown as License[];
    } catch (error) {
      console.error('❌ [LicenseAPI] Exception capturée:', {
        type: error instanceof Error ? error.constructor.name : typeof error,
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
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
