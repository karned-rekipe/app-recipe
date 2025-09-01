# Utilisation de l'API des Recettes

Ce guide explique comment utiliser le service API pour récupérer les recettes depuis le serveur.

## Configuration

L'API des recettes est configurée dans `config/api.ts` :

```typescript
const config = {
  // URL de base pour les recettes
  RECIPE_API_URL: 'http://localhost:9005/recipe/v1',
  
  // Endpoints des recettes
  recipe: {
    list: '/', // Récupérer la liste des recettes
  },
}
```

## Services

### RecipeApiService

Le service `RecipeApiService` gère les appels API vers le service des recettes :

```typescript
import { recipeApiService } from '../services';

// Récupérer les recettes (nécessite tokens et licence)
const response = await recipeApiService.getRecipes(tokens, activeLicense);
```

## Hook useRecipeApi

Le hook `useRecipeApi` fournit une interface React facile à utiliser :

```typescript
import { useRecipeApi } from '../hooks';

function MyComponent() {
  const { recipes, loading, error, getRecipes, clearError } = useRecipeApi();

  useEffect(() => {
    getRecipes();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return <RecipeList recipes={recipes} />;
}
```

## Exemple d'intégration

Voici comment modifier l'écran principal pour utiliser l'API au lieu des données de sample :

```tsx
// app/(tabs)/index.tsx
import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from "react-native";
import RecipeList from "../../components/RecipeList";
import { useRecipeApi } from "../../hooks";
import { Recipe } from "../../types/Recipe";
import { LoadingSpinner, ErrorState } from "../../components";

export default function RecipeListScreen() {
  const { recipes, loading, error, getRecipes, clearError } = useRecipeApi();

  useEffect(() => {
    // Charger les recettes au montage du composant
    getRecipes();
  }, [getRecipes]);

  const handleRecipePress = (recipe: Recipe) => {
    router.push(`/recipe-details?id=${recipe.uuid}`);
  };

  const handleRetry = () => {
    clearError();
    getRecipes();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState 
          message={error}
          onRetry={handleRetry}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <RecipeList 
          recipes={recipes || []}
          onRecipePress={handleRecipePress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
});
```

## Authentification et Licence

L'API des recettes nécessite :

1. Un token Bearer d'authentification
2. Une clé de licence dans l'en-tête `X-License-Key`

Ces éléments sont automatiquement gérés par le service si l'utilisateur est authentifié et a une licence active.

## Gestion des erreurs

Le service gère plusieurs types d'erreurs :

- Erreurs d'authentification (token invalide)
- Erreurs de licence (licence invalide ou manquante)
- Erreurs réseau
- Erreurs de format de données

Toutes les erreurs sont loggées dans la console pour le débogage.

## Structure des données

Les recettes retournées par l'API respectent l'interface `Recipe` définie dans `types/Recipe.ts`.
