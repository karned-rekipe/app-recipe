# Gestion des Étapes - Nouvelle Architecture

## Vue d'ensemble

Le système de gestion des étapes a été refactorisé pour respecter les principes SRP (Single Responsibility Principle) et de composition, tout en réutilisant les composants existants.

## Nouvelles Fonctionnalités des Étapes

### Structure des Données

Les étapes supportent maintenant les champs suivants :

```typescript
interface Step {
  step_number: number;
  title: string;           // NOUVEAU
  description: string;
  total_duration: number;  // NOUVEAU - calculé automatiquement
  cooking_duration: number;     // NOUVEAU
  rest_duration: number;        // NOUVEAU  
  preparation_duration: number; // NOUVEAU
  created_by: string | null;
}
```

### Calcul Automatique de la Durée

La `total_duration` est automatiquement calculée comme la somme de :
- `preparation_duration`
- `cooking_duration` 
- `rest_duration`

## Composants Créés

### 1. NumberSelector (Réutilisable)

Composant générique pour sélectionner des nombres avec boutons +/-.

```tsx
<NumberSelector
  value={4}
  onValueChange={setValue}
  minValue={1}
  maxValue={20}
  label="personne(s)"
  size="large" // small | medium | large
  suffix="min"
/>
```

**Utilisations :**
- Nombre de personnes (taille large)
- Quantité de parts (taille medium)
- Durées (taille small)

### 2. ControlledDurationSelector

Composant contrôlé pour les durées avec React Hook Form.

```tsx
<ControlledDurationSelector
  name="cooking_duration"
  control={control}
  label="Cuisson"
  step={5}
  size="small"
/>
```

### 3. ControlledStepModalV2

Modale complète pour ajouter/modifier une étape avec tous les nouveaux champs.

```tsx
<ControlledStepModalV2
  visible={visible}
  stepNumber={stepNumber}
  onSave={handleSave}
  onCancel={handleCancel}
  initialData={step} // Pour l'édition
  mode="edit" // ou "add"
/>
```

### 4. StepFormItem

Composant d'affichage d'une étape dans une liste de formulaire.

```tsx
<StepFormItem
  step={step}
  index={index}
  onEdit={handleEdit}
/>
```

## Gestion des Tailles

### Nombre de Personnes
- **Taille :** Large
- **Position :** Une ligne complète
- **Utilisation :** Pour définir le nombre de convives

### Quantité de Parts
- **Taille :** Medium  
- **Position :** Une ligne séparée mais plus compacte
- **Utilisation :** Pour définir le nombre d'unités (ex: 12 crêpes pour 4 personnes = 3 par personne)

### Durées
- **Taille :** Small
- **Position :** Grille 2x2 dans la modale
- **Types :** Préparation, Cuisson, Repos

## Exemple d'Utilisation

Voir `examples/StepManagementExample.tsx` pour un exemple complet d'intégration.

## Principes Respectés

### SRP (Single Responsibility Principle)
- `NumberSelector` : Gestion générique des sélecteurs numériques
- `ControlledDurationSelector` : Intégration avec React Hook Form
- `ControlledStepModalV2` : Logique de la modale d'étapes
- `StepFormItem` : Affichage d'une étape

### Composition
- Réutilisation de `BaseModal` et `useModalForm`
- Composition de `NumberSelector` dans `ControlledDurationSelector`
- Intégration avec les gestionnaires de listes existants

### Réutilisabilité
- `NumberSelector` peut être utilisé pour tous types de compteurs
- Les composants de durée sont réutilisables dans d'autres contextes
- Architecture modulaire permettant l'extension facile
