# Guide d'utilisation de l'architecture refactorisée

## 🚀 Démarrage rapide

### Import des composants
```typescript
import { 
  Badge, 
  Section, 
  PlaceholderText,
  ErrorState,
  DetailItem
} from '../components';
```

### Import des constantes
```typescript
import { theme, messages } from '../constants';
```

### Import des utilitaires
```typescript
import { formatTime, getDifficultyStars } from '../utils';
```

### Import des hooks
```typescript
import { useRecipe } from '../hooks';
```

## 📚 Exemples d'utilisation

### 1. Créer un nouveau badge
```typescript
<Badge 
  text="Nouveau" 
  backgroundColor={theme.colors.badge.default} 
/>
```

### 2. Afficher une section avec contenu
```typescript
<Section title="Ma Section">
  <Text>Contenu personnalisé</Text>
</Section>
```

### 3. Gérer les états d'erreur
```typescript
{error && (
  <ErrorState
    message={messages.errors.recipeNotFound}
    onRetry={handleRetry}
    retryButtonText={messages.actions.retry}
  />
)}
```

### 4. Formater le temps intelligemment
```typescript
// 90 minutes → "1h30min"
const formattedTime = formatTime(90);

// 45 minutes → "45 minutes"  
const formattedTime = formatTime(45);
```

### 5. Utiliser DetailItem avec icône
```typescript
<DetailItem
  icon={<Ionicons name="star" size={20} color={theme.colors.primary} />}
  text="Information importante"
  justify="flex-start"
/>
```

## 🎨 Personnalisation du thème

### Modifier les couleurs
```typescript
// Dans constants/theme.ts
colors: {
  primary: '#FF6B6B', // Nouvelle couleur primaire
  badge: {
    nouveau: '#E3F2FD', // Nouveau type de badge
  }
}
```

### Ajouter des espacements
```typescript
// Dans constants/theme.ts
spacing: {
  xxxl: 32, // Nouvel espacement
}
```

## 🔧 Créer de nouveaux composants

### Template de composant basique
```typescript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../constants';

interface MonComposantProps {
  // Définir les props
}

export const MonComposant: React.FC<MonComposantProps> = ({ 
  /* props */ 
}) => {
  return (
    <View style={styles.container}>
      {/* Contenu */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Utiliser le thème
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
});
```

### Ajouter au fichier d'index
```typescript
// Dans components/index.ts
export { MonComposant } from './MonComposant';
```

## 🎯 Bonnes pratiques

### 1. Responsabilité unique
- Chaque composant doit avoir une seule responsabilité
- Préférer la composition à l'héritage

### 2. Configuration centralisée
- Utiliser `theme` pour tous les styles visuels
- Utiliser `messages` pour tous les textes
- Éviter les valeurs en dur

### 3. Réutilisabilité
- Créer des composants atomiques réutilisables
- Utiliser des props pour la customisation
- Implémenter des variants quand nécessaire

### 4. Performance
- Utiliser `useMemo` et `useCallback` appropriés
- Éviter les re-rendus inutiles
- Optimiser les imports

### 5. Maintenabilité
- Nommer les composants de manière explicite
- Documenter les props complexes
- Garder les composants petits et focalisés

## 🧪 Tests

### Test d'un composant simple
```typescript
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge', () => {
  it('affiche le texte correctement', () => {
    const { getByText } = render(
      <Badge text="Test" backgroundColor="#fff" />
    );
    expect(getByText('Test')).toBeTruthy();
  });
});
```

### Test avec des hooks
```typescript
import { renderHook } from '@testing-library/react-native';
import { useRecipe } from '../useRecipe';

describe('useRecipe', () => {
  it('retourne la bonne recette', () => {
    const { result } = renderHook(() => useRecipe('1'));
    expect(result.current?.name).toBe('Coq au Vin');
  });
});
```

Cette architecture modulaire permet une évolution fluide et une maintenance simplifiée de votre application. 🎉
