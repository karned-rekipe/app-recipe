# DifficultySelector - Composant de Sélection de Difficulté

## Description

Le `DifficultySelector` est un composant React Native qui permet aux utilisateurs de sélectionner un niveau de difficulté pour une recette, avec une échelle de 1 à 3 représentée par des émojis de toques de chef.

## Caractéristiques

- **Design cohérent** : Suit les mêmes principes que le `PriceSelector`
- **Accessibilité** : Support complet avec labels et états
- **TypeScript** : Typage strict avec `DifficultyValue`
- **React Hook Form** : Intégration native avec le composant contrôlé
- **Validation** : Gestion d'erreurs intégrée
- **Responsive** : S'adapte aux différentes tailles d'écran

## Utilisation

### Import

```typescript
import { DifficultySelector, DifficultyValue } from '../components/forms';
```

### Utilisation Standalone

```tsx
const [difficulty, setDifficulty] = useState<DifficultyValue | undefined>();

<DifficultySelector
  value={difficulty}
  onValueChange={setDifficulty}
  error="Veuillez sélectionner une difficulté"
  disabled={false}
/>
```

### Avec React Hook Form

```typescript
import { ControlledDifficultySelector } from '../components/forms';

<ControlledDifficultySelector
  name="difficulty"
  control={control}
  rules={{ required: 'La difficulté est requise' }}
  disabled={false}
/>
```

## Props

### DifficultySelector

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `value` | `DifficultyValue \| undefined` | Non | `undefined` | Valeur sélectionnée (1, 2, ou 3) |
| `onValueChange` | `(value: DifficultyValue) => void` | Oui | - | Callback appelé lors d'un changement |
| `disabled` | `boolean` | Non | `false` | Désactive le composant |
| `error` | `string` | Non | `undefined` | Message d'erreur à afficher |

### ControlledDifficultySelector

| Prop | Type | Requis | Défaut | Description |
|------|------|--------|--------|-------------|
| `name` | `TName` | Oui | - | Nom du champ dans le formulaire |
| `control` | `Control<TFieldValues>` | Oui | - | Contrôleur React Hook Form |
| `rules` | `RegisterOptions` | Non | `undefined` | Règles de validation |
| `disabled` | `boolean` | Non | `false` | Désactive le composant |

## Types

```typescript
export type DifficultyValue = 1 | 2 | 3;
```

## Niveaux de Difficulté

| Valeur | Emoji | Label | Description |
|--------|-------|-------|-------------|
| 1 | 👨‍🍳 | Facile | Recettes simples et rapides |
| 2 | 👨‍🍳👨‍🍳 | Moyen | Recettes nécessitant quelques techniques |
| 3 | 👨‍🍳👨‍🍳👨‍🍳 | Difficile | Recettes complexes pour cuisiniers expérimentés |

## Intégration dans ModernRecipeForm

Le composant est placé entre le `PriceSelector` et le `PersonCountSelector` dans le formulaire de recette :

```tsx
<ControlledPriceSelector
  name="price"
  control={control}
  rules={{ required: 'Veuillez sélectionner un niveau de prix' }}
/>

<ControlledDifficultySelector
  name="difficulty"
  control={control}
  rules={{ required: 'Veuillez sélectionner un niveau de difficulté' }}
/>

<ControlledPersonCountSelector
  name="number_of_persons"
  control={control}
  // ...
/>
```

## Architecture

### Principe de Responsabilité Unique (SRP)

Le composant respecte le SRP en se concentrant uniquement sur :
- La sélection de difficulté
- L'affichage visuel des options
- La gestion des interactions utilisateur
- La propagation des changements

### Réutilisabilité

- Interface générique adaptable
- Styling cohérent avec le design system
- Séparation claire entre logique et présentation
- Support TypeScript complet

## Exemples

Voir les fichiers d'exemple :
- `examples/DifficultySelectorExample.tsx` - Utilisation basique
- `examples/DifficultyIntegrationTest.tsx` - Test d'intégration

## Tests

Le composant peut être testé en utilisant les exemples fournis ou en créant des tests unitaires avec Jest et React Native Testing Library.

## Accessibilité

- Support des lecteurs d'écran
- Navigation au clavier
- États visuels clairs (sélectionné, désactivé)
- Labels descriptifs pour chaque option
