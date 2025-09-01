# Système d'authentification

Ce document décrit l'implémentation du système d'authentification de l'application.

## Architecture

Le système d'authentification suit le principe de responsabilité unique (SRP) avec une séparation claire des responsabilités :

### 1. Types (`types/Auth.ts`)
- Définit toutes les interfaces TypeScript pour l'authentification
- `LoginCredentials`, `AuthTokens`, `AuthResponse`, `User`, etc.

### 2. Services

#### AuthApiService (`services/AuthApiService.ts`)
- **Responsabilité** : Communication avec l'API d'authentification
- **Méthodes** :
  - `login()` : Connexion utilisateur
  - `refreshToken()` : Rafraîchissement du token
  - `getUserInfo()` : Récupération des informations utilisateur
- **Pattern** : Singleton pour éviter les instances multiples

#### SecureStorageService (`services/SecureStorageService.ts`)
- **Responsabilité** : Stockage sécurisé des tokens
- **Méthodes** :
  - `storeTokens()` : Sauvegarde sécurisée des tokens
  - `getTokens()` : Récupération des tokens
  - `isTokenExpired()` : Vérification de l'expiration
  - `clearTokens()` : Suppression des tokens
- **Sécurité** : Utilise `expo-secure-store` sur mobile et `localStorage` sur web

### 3. Contexte d'authentification (`contexts/AuthContext.tsx`)
- **Responsabilité** : Gestion de l'état global d'authentification
- **État** : `isAuthenticated`, `isLoading`, `user`, `tokens`, `error`
- **Actions** : `signIn()`, `signOut()`, `refreshTokens()`, `clearError()`
- **Fonctionnalités** :
  - Vérification automatique de l'authentification au démarrage
  - Gestion automatique du refresh token
  - Persistance de l'état entre les sessions

### 4. Composants

#### AuthGuard (`components/auth/AuthGuard.tsx`)
- **Responsabilité** : Protection des routes et redirection automatique
- **Fonctionnement** :
  - Redirige vers `/login` si non authentifié
  - Redirige vers `/(tabs)` si déjà connecté

#### LoginForm (`components/auth/LoginForm.tsx`)
- **Responsabilité** : Interface de connexion
- **Fonctionnalités** :
  - Validation des champs en temps réel
  - Gestion des erreurs
  - Interface utilisateur intuitive

#### UserHeader (`components/auth/UserHeader.tsx`)
- **Responsabilité** : Affichage des informations utilisateur et déconnexion

### 5. Hooks

#### useApiRequest (`hooks/useApiRequest.ts`)
- **Responsabilité** : Requêtes API authentifiées
- **Fonctionnalités** :
  - Gestion automatique des tokens
  - Refresh automatique en cas d'expiration
  - Méthodes de commodité : `get()`, `post()`, `put()`, `delete()`

## Configuration

### API Endpoint
```typescript
const API_BASE_URL = 'https://api.karned.bzh/auth/v1';
```

### Routes
- **Token** : `POST /token` - Connexion et refresh
- **User Info** : `GET /me` - Informations utilisateur

### Stockage sécurisé
- **Mobile** : `expo-secure-store` (chiffrement matériel)
- **Web** : `localStorage` (moins sécurisé mais nécessaire)

## Utilisation

### 1. Envelopper l'application
```tsx
// app/_layout.tsx
<AuthProvider>
  <AuthGuard>
    {/* Votre application */}
  </AuthGuard>
</AuthProvider>
```

### 2. Utiliser l'authentification
```tsx
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { isAuthenticated, user, signOut } = useAuth();
  // ...
}
```

### 3. Faire des requêtes authentifiées
```tsx
import { useApiRequest } from '../hooks/useApiRequest';

function MyComponent() {
  const { get, post } = useApiRequest();
  
  const fetchData = async () => {
    const response = await get('/api/data');
    if (response.error) {
      // Gérer l'erreur
    } else {
      // Utiliser response.data
    }
  };
}
```

## Sécurité

### Tokens
- **Access Token** : JWT courte durée de vie pour les requêtes API
- **Refresh Token** : Token longue durée pour renouveler l'access token
- **Stockage** : Chiffré avec le système de sécurité de l'appareil

### Gestion des erreurs
- **401 Unauthorized** : Refresh automatique du token
- **Échec du refresh** : Déconnexion automatique
- **Erreurs réseau** : Messages utilisateur appropriés

### Bonnes pratiques
- Vérification automatique de l'expiration des tokens
- Marge de sécurité de 5 minutes avant expiration
- Suppression sécurisée des tokens lors de la déconnexion
- Gestion centralisée des erreurs d'authentification

## Tests

### Composants testables
Tous les composants incluent des `testID` pour les tests automatisés :
- `login-username-input`
- `login-password-input`
- `login-submit-button`
- `sign-out-button`

### Scénarios de test recommandés
1. Connexion avec identifiants valides
2. Gestion des erreurs de connexion
3. Refresh automatique des tokens
4. Déconnexion
5. Protection des routes
6. Persistance de la session

## Maintenance

### Logs
- Les erreurs sont loggées en console pour le debug
- Aucune information sensible n'est loggée

### Monitoring
- Surveillez les erreurs de refresh token
- Surveillez les échecs de connexion
- Surveillez les performances de l'API

### Mises à jour
- Vérifiez régulièrement la compatibilité avec l'API
- Mettez à jour les dépendances de sécurité
- Testez sur différentes plateformes (iOS, Android, Web)
