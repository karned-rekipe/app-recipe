# Architecture des Services selon le SRP

## 🎯 Vue d'ensemble

L'architecture des services a été conçue selon le **Principe de Responsabilité Unique (SRP)**. Chaque classe a une seule responsabilité et une seule raison de changer, ce qui améliore la maintenabilité, la testabilité et l'extensibilité.

## 🏗️ Structure des Services

### Services Principaux

```
📁 services/
├── AuthApiService.ts              # Authentification utilisateur
├── LicenseApiService.ts           # Gestion des licences
├── AuthenticatedApiService.ts     # Requêtes API authentifiées
├── RecipeApiService.ts            # API des recettes
├── SecureStorageService.ts        # Stockage sécurisé des tokens
└── index.ts                       # Exports unifiés
```

### Architecture Modulaire

```
📁 services/
├── 📁 interfaces/           # Contrats et interfaces
│   ├── ICryptoService.ts
│   ├── ITokenStorageAdapter.ts
│   ├── ITokenValidator.ts
│   └── IStorageDetectionService.ts
├── 📁 crypto/              # Services de chiffrement
│   └── SimpleCryptoService.ts
├── 📁 storage/             # Détection des services de stockage
│   └── StorageDetectionService.ts
├── 📁 validation/          # Validation des données
│   └── TokenValidator.ts
└── 📁 adapters/            # Adaptateurs de stockage
    ├── SecureStoreAdapter.ts
    └── AsyncStorageAdapter.ts
```

## 🔧 Services Détaillés

### 1. AuthApiService
**Responsabilité** : Authentification utilisateur (login, refresh token)
- ✅ Validation des credentials
- ✅ Appels API d'authentification
- ✅ Gestion des erreurs d'auth
- ✅ Logs sécurisés avec masquage des tokens

### 2. LicenseApiService  
**Responsabilité** : Gestion des licences utilisateur
- ✅ Récupération des licences
- ✅ Validation des permissions
- ✅ Vérification des expirations
- ✅ Logs sécurisés

### 3. SecureStorageService
**Responsabilité** : Orchestration du stockage sécurisé
- ✅ Stratégie de fallback (SecureStore → AsyncStorage chiffré)
- ✅ Validation des tokens
- ✅ Gestion de l'expiration
- ✅ Architecture modulaire avec composants spécialisés

### 4. AuthenticatedApiService
**Responsabilité** : Requêtes API avec authentification
- ✅ Construction des headers d'authentification
- ✅ Gestion des licences dans les requêtes
- ✅ Validation des paramètres
- ✅ Logs sécurisés des requêtes

### 5. RecipeApiService
**Responsabilité** : API spécialisée pour les recettes
- ✅ Validation des recettes
- ✅ Transformation des données
- ✅ Gestion d'erreurs spécialisée
- ✅ Logs contextuels

## 🔒 Sécurité des Logs

### Masquage Automatique
Tous les services utilisent les utilitaires de masquage pour protéger les données sensibles :

```typescript
// Tokens masqués dans les logs
maskToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
// → "eyJhbGciOi...cCI6IkpXVCJ9"

// Emails masqués
maskEmail("user@example.com")
// → "u***r@e***.com"
```

### Application Systématique
- ✅ **AuthApiService** : Tokens masqués dans les réponses d'auth
- ✅ **SecureStorageService** : Tokens masqués lors du stockage/récupération
- ✅ **AuthenticatedApiService** : Tokens masqués dans les requêtes
- ✅ **RecipeApiService** : Tokens masqués dans les logs d'API
- ✅ **LicenseApiService** : Tokens masqués lors des appels

## 📋 Utilisation

### Import Simple
```typescript
import { 
  authApiService,
  secureStorageService,
  licenseApiService,
  recipeApiService,
  authenticatedApiService
} from './services';
```

### Exemple d'Utilisation
```typescript
// 1. Authentification
const authResponse = await authApiService.login(credentials);

// 2. Stockage sécurisé
await secureStorageService.storeTokens(authResponse.tokens);

// 3. Récupération de licence
const license = await licenseApiService.getRecipeLicense(tokens.access_token);

// 4. Appel API
const recipes = await recipeApiService.getRecipes(tokens, license);
```

## ✅ Avantages de l'Architecture

### Respect du SRP
- **Une responsabilité par classe** : Chaque service a un rôle bien défini
- **Facilité de compréhension** : Code plus lisible et organisé
- **Maintenance simplifiée** : Modifications isolées par responsabilité

### Testabilité
- **Tests unitaires** : Chaque composant testable indépendamment
- **Mocking facile** : Interfaces permettent l'injection de mocks
- **Tests d'intégration** : Services principaux testables avec des composants réels

### Extensibilité
- **Nouveaux adaptateurs** : Ajout facile via les interfaces
- **Nouveaux algorithmes** : Remplacement simple des implémentations
- **Nouvelles fonctionnalités** : Extension sans impact sur l'existant

### Sécurité
- **Logs sécurisés** : Masquage automatique des données sensibles
- **Validation centralisée** : Composants dédiés à la validation
- **Séparation des responsabilités** : Isolation des préoccupations de sécurité

### Performance
- **Lazy loading** : Instanciation à la demande
- **Optimisations ciblées** : Performance par responsabilité
- **Réduction de la complexité** : Services plus focalisés

## 🔄 Patterns Utilisés

### Singleton
Tous les services principaux utilisent le pattern Singleton pour une instance unique :
```typescript
export const authApiService = AuthApiService.getInstance();
```

### Strategy Pattern
Le `SecureStorageService` utilise une stratégie de fallback avec différents adaptateurs.

### Adapter Pattern
Les `SecureStoreAdapter` et `AsyncStorageAdapter` adaptent les APIs natives.

### Facade Pattern
Les services principaux servent de façade pour orchestrer les composants internes.

## 📊 Métriques

### Avant la Refactorisation
- **Classes monolithiques** : 1 classe = 5-7 responsabilités
- **Tests difficiles** : Couplage fort, mocking complexe
- **Maintenance coûteuse** : Modifications à impact large
- **Logs non sécurisés** : Exposition de données sensibles

### Après la Refactorisation
- **Architecture modulaire** : 1 classe = 1 responsabilité
- **Tests simplifiés** : Composants isolés, mocking facile
- **Maintenance ciblée** : Modifications localisées
- **Logs sécurisés** : Masquage automatique des données sensibles

Cette architecture respecte les principes SOLID et fournit une base solide pour l'évolution future de l'application.
