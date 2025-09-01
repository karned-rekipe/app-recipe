# Implémentation de l'API des Recettes - Résumé

## Ajouts réalisés

### 1. Configuration API (config/api.ts)

- Ajout de `RECIPE_API_URL: 'http://localhost:9005/recipe/v1'`
- Ajout de l'endpoint `recipe.list: '/'` pour la récupération des recettes

### 2. Service RecipeApiService (services/RecipeApiService.ts)

- **Responsabilité unique** : Gestion des appels API vers le service des recettes
- Méthode `getRecipes(tokens, license)` pour récupérer la liste des recettes
- Gestion automatique des en-têtes :
  - `Authorization: Bearer {token}`
  - `X-License-Key: {license.uuid}`
- Gestion complète des erreurs (réseau, authentification, format)
- Logging détaillé pour le débogage
- Validation du format de réponse (doit être un tableau)
- Pattern Singleton pour optimiser les performances

### 3. Hook useRecipeApi (hooks/useRecipeApi.ts)

- **Responsabilité unique** : Interface React pour l'API des recettes
- État local pour `recipes`, `loading`, `error`
- Méthodes `getRecipes()` et `clearError()`
- Vérifications automatiques de l'authentification et de la licence
- Intégration avec le contexte d'authentification existant

### 4. Documentation (docs/API_RECIPES_USAGE.md)

- Guide complet d'utilisation
- Exemples de code pour l'intégration
- Description des erreurs possibles
- Instructions pour remplacer les données de sample

### 5. Exports mis à jour

- `services/index.ts` : Export de RecipeApiService
- `hooks/index.ts` : Export de useRecipeApi

## Respect du principe SRP (Single Responsibility Principle)

1. **RecipeApiService** : Se contente uniquement des appels HTTP vers l'API des recettes
2. **useRecipeApi** : Gère uniquement l'état React et l'interface utilisateur
3. **Configuration** : Centralisée dans config/api.ts
4. Séparation claire des responsabilités entre les couches

## Utilisation

```typescript
// Dans un composant React
import { useRecipeApi } from '../hooks';

const { recipes, loading, error, getRecipes } = useRecipeApi();

// Chargement initial
useEffect(() => {
  getRecipes();
}, []);
```

## URL et en-têtes de l'API

- **URL** : `http://localhost:9005/recipe/v1/`
- **Méthode** : GET
- **En-têtes requis** :
  - `Authorization: Bearer {access_token}`
  - `X-License-Key: {license_uuid}`
  - `Accept: application/json`
  - `Content-Type: application/json`

## Format de réponse attendu

Un tableau de recettes conformes à l'interface `Recipe` :

```typescript
Recipe[] // Tableau d'objets Recipe avec uuid, name, description, etc.
```

L'implémentation est maintenant prête pour remplacer les données de sample (`sampleRecipes`) par des données provenant de l'API.
