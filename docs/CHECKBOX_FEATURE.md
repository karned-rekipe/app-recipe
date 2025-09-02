# Fonctionnalité Cases à Cocher pour Recettes

## Description

Cette fonctionnalité ajoute des cases à cocher interactives aux trois sections principales de la fiche détail d'une recette :

- **Ingrédients** : Pour marquer les ingrédients préparés ou utilisés
- **Ustensiles** : Pour vérifier que l'ustensile est disponible ou utilisé
- **Étapes** : Pour suivre la progression dans la préparation de la recette

## Fonctionnement

### Interaction
- **Clic/Tap** : Cliquer sur n'importe quelle partie d'un élément (ingredient, ustensile, étape) pour cocher/décocher
- **Feedback visuel** : 
  - Case cochée avec checkmark ✓ en blanc sur fond de couleur primaire
  - Texte rayé (line-through) et grisé pour les éléments cochés

### Interface Utilisateur

#### Cases à cocher
- **Taille** : 20x20px avec bordure arrondie (4px radius)
- **États** :
  - Non cochée : Bordure grise, fond blanc
  - Cochée : Fond couleur primaire, bordure couleur primaire, checkmark blanc ✓

#### Effets visuels sur le texte
- **Texte rayé** (`textDecorationLine: 'line-through'`)
- **Couleur grisée** (couleur secondaire du thème)
- **Opacité réduite** (0.6) pour l'effet "désactivé"

## Composants Modifiés

### 1. IngredientsList.tsx
```typescript
interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
  checked: boolean;
  onToggle: (index: number) => void;
}
```

### 2. UtensilsList.tsx
```typescript
interface UtensilItemProps {
  utensil: string;
  index: number;
  checked: boolean;
  onToggle: (index: number) => void;
}
```

### 3. StepsList.tsx
```typescript
interface StepItemProps {
  step: Step;
  index: number;
  checked: boolean;
  onToggle: (index: number) => void;
}
```

## Gestion de l'État

Chaque liste gère son propre état local avec `useState` :

```typescript
const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
  new Array(ingredients.length).fill(false)
);
```

- **État initial** : Tous les éléments sont décochés (`false`)
- **Persistance** : L'état est maintenu pendant la session mais se réinitialise à la navigation
- **Indépendance** : Chaque liste (ingrédients, ustensiles, étapes) gère son état indépendamment

## Utilisation

### Pour l'utilisateur
1. Naviguer vers une recette
2. Cliquer sur un ingrédient, ustensile ou étape pour le marquer comme "fait"
3. Le texte se raye et devient gris pour indiquer l'accomplissement
4. Cliquer à nouveau pour décocher

### Cas d'usage
- **Courses** : Cocher les ingrédients au fur et à mesure des achats
- **Préparation** : Vérifier la disponibilité des ustensiles
- **Cuisson** : Suivre la progression des étapes de préparation

## Amélioration Future Possible

- **Persistance** : Sauvegarder l'état dans le stockage local
- **Partage** : Partager l'état de progression entre appareils
- **Statistiques** : Suivre le taux de completion des recettes
- **Notification** : Rappels pour les étapes avec timing
