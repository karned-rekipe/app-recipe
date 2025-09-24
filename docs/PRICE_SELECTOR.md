# Composant de Sélection de Prix

## Description

Ce composant implémente un sélecteur de prix utilisant une interface de boutons avec des symboles € €€ €€€ représentant 3 niveaux de prix (1, 2, 3).

## Principe de Responsabilité Unique (SRP)

Le composant respecte le principe SRP en séparant les responsabilités :

### 1. `PriceSelector.tsx` - Composant de base
- **Responsabilité unique** : Affichage et interaction avec les boutons de prix
- **Aucune dépendance** avec React Hook Form
- **Réutilisable** dans n'importe quel contexte

### 2. `ControlledPriceSelector.tsx` - Wrapper pour React Hook Form
- **Responsabilité unique** : Intégration avec React Hook Form
- **Utilise** le composant de base `PriceSelector`
- **Gère** la validation et les erreurs

### 3. `types.ts` - Types TypeScript
- **Responsabilité unique** : Définition des types
- **PriceValue** : Type union pour les valeurs 1 | 2 | 3

## Utilisation

### Composant autonome
```tsx
import { PriceSelector, PriceValue } from './components/forms/PriceSelector';

function MyComponent() {
  const [price, setPrice] = useState<PriceValue>(1);
  
  return (
    <PriceSelector
      value={price}
      onValueChange={setPrice}
      error="Message d'erreur optionnel"
      disabled={false}
    />
  );
}
```

### Avec React Hook Form
```tsx
import { ControlledPriceSelector } from './components/forms/ControlledPriceSelector';

function MyForm() {
  const { control } = useForm<RecipeFormData>();
  
  return (
    <ControlledPriceSelector
      name="price"
      control={control}
      rules={{ required: 'Veuillez sélectionner un niveau de prix' }}
    />
  );
}
```

## Bonnes Pratiques Implémentées

### 1. **Accessibilité**
- `accessibilityLabel` pour chaque bouton
- `accessibilityRole="button"`
- `accessibilityState` avec `selected` et `disabled`

### 2. **Types TypeScript Stricts**
- Type union `PriceValue = 1 | 2 | 3`
- Props typées avec interfaces
- Generics pour React Hook Form

### 3. **Design System**
- Utilisation du thème centralisé
- Couleurs cohérentes
- Espacements standardisés

### 4. **Performance**
- `activeOpacity` pour un feedback visuel
- Évitement des re-renders inutiles
- Structure de données optimisée

### 5. **Maintenabilité**
- Séparation des préoccupations
- Composants réutilisables
- Configuration centralisée

## Structure des Fichiers

```
components/forms/
├── PriceSelector.tsx           # Composant de base
├── ControlledPriceSelector.tsx # Wrapper React Hook Form
├── types.ts                    # Types TypeScript
└── index.ts                    # Exports centralisés
```

## Valeurs de Prix

- **1** → € (Économique)
- **2** → €€ (Modéré) 
- **3** → €€€ (Élevé)

Le composant stocke les valeurs numériques (1, 2, 3) dans le formulaire mais affiche les symboles € correspondants à l'utilisateur.
