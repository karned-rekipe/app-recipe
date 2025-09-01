/**
 * Hook pour utiliser les licences
 * Fournit des fonctions utilitaires pour travailler avec les licences utilisateur
 */

import { useAuth } from '../contexts/AuthContext';
import type { License } from '../types/License';

export function useLicense() {
  const { licenses, activeLicense, setActiveLicense, refreshLicenses } = useAuth();

  /**
   * Vérifie si l'utilisateur a une permission pour une API donnée
   */
  const hasApiPermission = (apiName: string, permission: string, license?: License): boolean => {
    const targetLicense = license || activeLicense;
    if (!targetLicense) return false;

    const apiRoles = targetLicense.api_roles[apiName];
    return apiRoles ? apiRoles.roles.includes(permission) : false;
  };

  /**
   * Récupère toutes les permissions pour une API donnée
   */
  const getApiPermissions = (apiName: string, license?: License): string[] => {
    const targetLicense = license || activeLicense;
    if (!targetLicense) return [];

    const apiRoles = targetLicense.api_roles[apiName];
    return apiRoles ? apiRoles.roles : [];
  };

  /**
   * Trouve toutes les licences valides pour une API donnée
   */
  const getLicensesForApi = (apiName: string): License[] => {
    const currentTime = Math.floor(Date.now() / 1000);
    
    return licenses.filter(license => 
      license.api_roles[apiName] && 
      license.api_roles[apiName].roles.length > 0 &&
      license.exp > currentTime // Licence non expirée
    );
  };

  /**
   * Vérifie si l'utilisateur a accès à l'API des recettes
   */
  const hasRecipeAccess = (permission: 'read' | 'create' | 'update' | 'delete' = 'read'): boolean => {
    return hasApiPermission('api-recipe', permission);
  };

  /**
   * Récupère la première licence valide pour les recettes
   */
  const getRecipeLicense = (): License | null => {
    const recipeLicenses = getLicensesForApi('api-recipe');
    return recipeLicenses.length > 0 ? recipeLicenses[0] : null;
  };

  /**
   * Vérifie si une licence est expirée
   */
  const isLicenseExpired = (license: License): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    return license.exp <= currentTime;
  };

  /**
   * Formate la date d'expiration d'une licence
   */
  const formatExpirationDate = (license: License): string => {
    const date = new Date(license.exp * 1000);
    return date.toLocaleDateString('fr-FR');
  };

  return {
    // État des licences
    licenses,
    activeLicense,
    
    // Actions
    setActiveLicense,
    refreshLicenses,
    
    // Fonctions utilitaires
    hasApiPermission,
    getApiPermissions,
    getLicensesForApi,
    hasRecipeAccess,
    getRecipeLicense,
    isLicenseExpired,
    formatExpirationDate,
    
    // Raccourcis
    hasReadAccess: () => hasRecipeAccess('read'),
    hasWriteAccess: () => hasRecipeAccess('create') && hasRecipeAccess('update'),
    hasFullAccess: () => hasRecipeAccess('create') && hasRecipeAccess('update') && hasRecipeAccess('delete'),
  };
}
