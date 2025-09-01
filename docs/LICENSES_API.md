# Système de Licences et API Authentifiée

## Vue d'ensemble

Le système de licences permet de gérer l'accès aux différentes APIs selon les licences de l'utilisateur. Chaque utilisateur peut avoir plusieurs licences avec différents niveaux de permissions.

## Architecture

### Types de Licences
- **UUID unique** : Chaque licence a un UUID unique
- **Permissions par API** : Les licences définissent les permissions pour chaque API (read, create, update, delete)
- **Expiration** : Les licences ont une date d'expiration
- **Renouvellement automatique** : Option de renouvellement automatique

### API de Licences
- **Endpoint** : `http://localhost:9003/license/v1/mine`
- **Authentification** : Bearer Token requis
- **Réponse** : Liste des licences avec permissions détaillées

## Utilisation

### 1. Hook useLicense
```typescript
import { useLicense } from '../hooks/useLicense';

function MyComponent() {
  const { 
    licenses, 
    activeLicense, 
    hasRecipeAccess,
    setActiveLicense 
  } = useLicense();

  // Vérifier l'accès en lecture aux recettes
  const canRead = hasRecipeAccess('read');
  
  // Vérifier l'accès complet
  const hasFullAccess = hasFullAccess();

  return (
    <View>
      {canRead ? (
        <Text>Accès autorisé</Text>
      ) : (
        <Text>Accès refusé</Text>
      )}
    </View>
  );
}
```

### 2. Hook useAuthenticatedApi
```typescript
import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi';

function RecipeComponent() {
  const { getLicensed, postLicensed } = useAuthenticatedApi();

  const fetchRecipes = async () => {
    try {
      // Requête GET avec licence automatique
      const response = await getLicensed('http://localhost:9004/recipe/v1/list');
      console.log(response.data);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const createRecipe = async (recipeData) => {
    try {
      // Requête POST avec licence automatique
      const response = await postLicensed('http://localhost:9004/recipe/v1/create', recipeData);
      console.log('Recette créée:', response.data);
    } catch (error) {
      console.error('Erreur création:', error);
    }
  };

  return (
    // Votre composant...
  );
}
```

### 3. Service AuthenticatedApiService
```typescript
import { authenticatedApiService } from '../services/AuthenticatedApiService';

// Utilisation directe du service
const makeApiCall = async (tokens, license) => {
  const response = await authenticatedApiService.get(
    'http://localhost:9004/recipe/v1/list',
    tokens,
    license,
    { requiresLicense: true }
  );
  
  return response.data;
};
```

## Configuration API

### URLs de base
- **Auth API** : `http://localhost:9001/auth/v1`
- **License API** : `http://localhost:9003/license/v1`
- **Recipe API** : `http://localhost:9004/recipe/v1` (exemple)

### Headers automatiques
- `Authorization: Bearer {token}`
- `X-License-UUID: {license_uuid}` (si licence requise)
- `Content-Type: application/json`
- `accept: application/json`

## Gestion des Permissions

### Niveaux de permission API Recipe
- **read** : Lecture des recettes
- **create** : Création de nouvelles recettes
- **update** : Modification des recettes existantes
- **delete** : Suppression des recettes

### Vérification des permissions
```typescript
// Via le hook useLicense
const { hasApiPermission } = useLicense();
const canCreate = hasApiPermission('api-recipe', 'create');

// Directement sur une licence
import { licenseApiService } from '../services/LicenseApiService';
const hasPermission = licenseApiService.hasApiPermission(license, 'api-recipe', 'read');
```

## Interface Utilisateur

### Page Utilisateur
La page utilisateur (`/user`) affiche :
- Informations utilisateur
- Liste des licences avec statut
- Licence active sélectionnée
- Permissions par licence
- Bouton de déconnexion

### Sélection de Licence
Les utilisateurs peuvent changer de licence active si ils en ont plusieurs. La licence sélectionnée sera utilisée automatiquement pour toutes les requêtes API.

## Flux d'Authentification

1. **Connexion** → Récupération du token d'accès
2. **Récupération des licences** → Appel à l'API des licences
3. **Sélection de la licence active** → Généralement la première licence valide
4. **Requêtes API** → Token + UUID de licence dans les headers

## Gestion des Erreurs

- **Token expiré** : Tentative de refresh automatique
- **Licence expirée** : Affichage d'un message d'erreur
- **Permissions insuffisantes** : Erreur HTTP 403
- **Pas de licence** : Redirection vers la sélection de licence

## Sécurité

- Tokens stockés de manière sécurisée (SecureStore/AsyncStorage chiffré)
- Vérification de l'expiration des tokens et licences
- Headers d'authentification automatiques
- Gestion des erreurs réseau

## Exemple Complet

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useAuthenticatedApi, useLicense } from '../hooks';

function RecipeListScreen() {
  const [recipes, setRecipes] = useState([]);
  const { getLicensed } = useAuthenticatedApi();
  const { hasRecipeAccess } = useLicense();

  useEffect(() => {
    if (hasRecipeAccess('read')) {
      loadRecipes();
    }
  }, [hasRecipeAccess]);

  const loadRecipes = async () => {
    try {
      const response = await getLicensed('http://localhost:9004/recipe/v1/list');
      setRecipes(response.data);
    } catch (error) {
      console.error('Erreur chargement recettes:', error);
    }
  };

  if (!hasRecipeAccess('read')) {
    return <Text>Accès aux recettes non autorisé</Text>;
  }

  return (
    <View>
      <FlatList
        data={recipes}
        renderItem={({ item }) => (
          <Text>{item.title}</Text>
        )}
      />
    </View>
  );
}
```
