# Country Select Components

Ces composants permettent de sélectionner un pays avec recherche et affichage des drapeaux, en respectant le principe SRP (Single Responsibility Principle).

## Composants créés

### 1. `CountrySelect`
Composant de base pour la sélection de pays avec :
- Affichage du drapeau et du nom du pays
- Modal de sélection avec recherche
- Support du placeholder et des états d'erreur
- Interface intuitive et accessible

### 2. `ControlledCountrySelect`
Version intégrée avec React Hook Form :
- Gestion automatique des erreurs de validation
- Intégration native avec `useForm` et `Controller`
- Support des règles de validation personnalisées

## Utilisation

### Avec React Hook Form (recommandé)

```tsx
import { ControlledCountrySelect } from './components/forms';
import { useForm } from 'react-hook-form';

function MyForm() {
  const { control } = useForm();
  
  return (
    <ControlledCountrySelect
      name="origin_country"
      control={control}
      label="Pays d'origine"
      placeholder="Sélectionner un pays"
      required
    />
  );
}
```

### Utilisation directe

```tsx
import { CountrySelect } from './components/forms';

function MyComponent() {
  const [selectedCountry, setSelectedCountry] = useState('');
  
  return (
    <CountrySelect
      value={selectedCountry}
      onValueChange={setSelectedCountry}
      label="Pays d'origine"
      placeholder="Sélectionner un pays"
    />
  );
}
```

## Fonctionnalités

- **Recherche rapide** : Tapez pour filtrer les pays
- **Drapeaux** : Affichage automatique des drapeaux emoji
- **Accessibilité** : Support des lecteurs d'écran
- **Validation** : Intégration avec React Hook Form
- **Personnalisable** : Styles et comportements configurables

## Architecture (SRP)

Chaque composant a une responsabilité unique :
- `CountrySelect` : Gestion de l'interface utilisateur
- `ControlledCountrySelect` : Intégration React Hook Form
- `countryFlags.ts` : Données et logique des pays
- `getAllCountries()` : Récupération de la liste des pays

Cette séparation permet une meilleure maintenabilité et réutilisabilité.
