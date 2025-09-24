# Composants de Sélection avec Compteurs (Counter Selectors)

## Vue d'ensemble

Cette documentation présente les nouveaux composants de sélection numérique avec boutons `+` et `-`, développés selon le principe de responsabilité unique (SRP) et les bonnes pratiques React/React Native.

## Architecture des Composants

### 1. `CounterSelector` - Composant de Base
Composant générique réutilisable qui implémente la logique de base pour les sélecteurs numériques.

**Caractéristiques :**
- Boutons `+` et `-` avec validation des limites
- Support de deux tailles : `large` et `small`
- Gestion des états désactivés
- Accessibilité intégrée
- Validation d'erreurs

### 2. `PersonCountSelector` - Spécialisé pour les Personnes
Composant spécialisé pour sélectionner le nombre de personnes.

**Caractéristiques :**
- Taille `large` par défaut
- Label automatique : "personne" / "personnes"
- Limites par défaut : 1-20 personnes
- Optimisé pour l'usage principal dans les recettes

### 3. `QuantitySelector` - Spécialisé pour les Quantités
Composant spécialisé pour sélectionner les quantités/parts.

**Caractéristiques :**
- Taille `small` par défaut
- Label configurable (par défaut : "part" / "parts")
- Limites par défaut : 1-99 unités
- Design compact pour usage secondaire

### 4. Composants Contrôlés pour React Hook Form
- `ControlledPersonCountSelector`
- `ControlledQuantitySelector`

## Utilisation

### Exemple Basique

```tsx
import { PersonCountSelector, QuantitySelector } from './components/forms';

// Nombre de personnes (taille importante)
<PersonCountSelector
  value={4}
  onValueChange={setPersonCount}
  minCount={1}
  maxCount={12}
/>

// Quantité (taille réduite)
<QuantitySelector
  value={12}
  onValueChange={setQuantity}
  minQuantity={1}
  maxQuantity={50}
  unit="crêpes"
/>
```

### Avec React Hook Form (Recommandé)

```tsx
import { useForm } from 'react-hook-form';
import { ControlledPersonCountSelector, ControlledQuantitySelector } from './components/forms';

const { control } = useForm({
  defaultValues: {
    number_of_persons: 4,
    quantity: 12
  }
});

// Nombre de personnes avec validation
<ControlledPersonCountSelector
  name="number_of_persons"
  control={control}
  rules={{ 
    required: 'Le nombre de personnes est requis',
    min: { value: 1, message: 'Minimum 1 personne' },
    max: { value: 20, message: 'Maximum 20 personnes' }
  }}
/>

// Quantité avec validation
<ControlledQuantitySelector
  name="quantity"
  control={control}
  rules={{ 
    required: 'La quantité est requise',
    min: { value: 1, message: 'Minimum 1 part' }
  }}
  unit="parts"
/>
```

## Cas d'Usage : Exemple des Crêpes

Comme demandé par l'utilisateur :
- **4 personnes** → Sélecteur principal (grande taille)
- **12 crêpes** → Sélecteur secondaire (petite taille)
- **Calcul automatique** → 3 crêpes par personne

```tsx
const [persons, setPersons] = useState(4);
const [totalCrepes, setTotalCrepes] = useState(12);
const crepesPerPerson = Math.round(totalCrepes / persons);

return (
  <View>
    {/* Ligne principale - Nombre de personnes */}
    <PersonCountSelector
      value={persons}
      onValueChange={setPersons}
      minCount={1}
      maxCount={12}
    />
    
    {/* Ligne secondaire - Quantité totale */}
    <QuantitySelector
      value={totalCrepes}
      onValueChange={setTotalCrepes}
      minQuantity={1}
      maxQuantity={50}
      unit="crêpes"
    />
    
    <Text>→ {crepesPerPerson} crêpes par personne</Text>
  </View>
);
```

## Principes de Design

### Single Responsibility Principle (SRP)
- **CounterSelector** : Logique de comptage générique
- **PersonCountSelector** : Spécialisé pour les personnes
- **QuantitySelector** : Spécialisé pour les quantités
- **Controlled Components** : Intégration avec React Hook Form

### Hiérarchie Visuelle
- **Nombre de personnes** : Taille large, importance visuelle élevée
- **Quantité** : Taille réduite, importance visuelle secondaire
- **Layout** : Chaque sélecteur sur sa propre ligne

### Accessibilité
- Labels descriptifs automatiques
- Rôles ARIA appropriés
- Support des lecteurs d'écran
- États visuels clairs (activé/désactivé)

## API Reference

### CounterSelector Props
```typescript
interface CounterSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;        // défaut: 1
  maxValue?: number;        // défaut: 99
  step?: number;            // défaut: 1
  disabled?: boolean;       // défaut: false
  size?: 'large' | 'small'; // défaut: 'large'
  label?: string;           // optionnel
  error?: string;           // optionnel
}
```

### PersonCountSelector Props
```typescript
interface PersonCountSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minCount?: number;    // défaut: 1
  maxCount?: number;    // défaut: 20
  disabled?: boolean;   // défaut: false
  error?: string;       // optionnel
}
```

### QuantitySelector Props
```typescript
interface QuantitySelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minQuantity?: number; // défaut: 1
  maxQuantity?: number; // défaut: 99
  disabled?: boolean;   // défaut: false
  error?: string;       // optionnel
  unit?: string;        // défaut: 'parts'
}
```

## Migration

### Remplacement des anciens inputs numériques

**Avant :**
```tsx
<ControlledInput
  name="number_of_persons"
  control={control}
  placeholder="Nombre de personnes"
  keyboardType="numeric"
/>
```

**Après :**
```tsx
<ControlledPersonCountSelector
  name="number_of_persons"
  control={control}
  rules={{ required: 'Le nombre de personnes est requis' }}
/>
```

## Tests

Les composants incluent :
- ✅ Tests unitaires
- ✅ Tests d'accessibilité
- ✅ Tests d'intégration avec React Hook Form
- ✅ Tests de validation des limites

## Performance

- Composants optimisés avec `React.memo` si nécessaire
- Callbacks mémorisés pour éviter les re-renders
- Pas de calculs coûteux dans le render
- Gestion efficace des états
