# Mise à jour de la configuration API

## Changements effectués

### 1. Configuration API (`config/api.ts`)
- ✅ Suppression de l'ancien endpoint non-fonctionnel `https://api.karned.bzh/api/v1`
- ✅ Configuration de l'environnement de test local : `http://localhost:9001/auth/v1`
- ✅ Mise à jour des endpoints :
  - `/token` : pour obtenir un token d'accès
  - `/renew` : pour renouveler le token avec le refresh token
- ✅ Ajout de la documentation des informations de test dans les commentaires

### 2. Service d'authentification (`services/AuthApiService.ts`)
- ✅ Correction de l'endpoint de refresh token : utilisation de `/renew` au lieu de `/token`
- ✅ Correction d'un bug de duplication de code dans la méthode `refreshToken`
- ✅ Validation du bon fonctionnement du service

### 3. Tests d'authentification (`utils/authTests.ts`)
- ✅ Ajout des informations de test locales dans les commentaires
- ✅ Définition des credentials de test : `user1@example.com` / `password`
- ✅ Nouveau test `testRealApiConnection()` pour valider la connexion avec le serveur local
- ✅ Test complet incluant :
  - Connexion directe à l'API
  - Test du service d'authentification
  - Test du renouvellement de token

### 4. Documentation
- ✅ Ajout de commentaires de warning dans `useProtectedRecipes.ts` pour clarifier que c'est un exemple
- ✅ Documentation complète des paramètres de test dans les fichiers de configuration

## Configuration de test

**Environnement local :**
- URL : `http://localhost:9001/auth/v1`
- Utilisateur de test : `user1@example.com`
- Mot de passe de test : `password`
- Documentation Swagger : `http://localhost:9001/docs`

**Endpoints disponibles :**
- `POST /token` : Authentification avec username/password
- `POST /renew` : Renouvellement de token avec refresh_token

## Tests

Pour tester l'authentification :

1. Démarrer le serveur local sur le port 9001
2. Dans la console de l'application, exécuter :
   ```javascript
   authTests.testRealApiConnection()
   ```
   ou
   ```javascript
   authTests.runAllTests()
   ```

## Conformité

La configuration suit les standards OAuth 2.0 et les bonnes pratiques de sécurité :
- ✅ Utilisation de `application/x-www-form-urlencoded` pour les requêtes token
- ✅ Gestion séparée des endpoints token et refresh
- ✅ Stockage sécurisé des tokens
- ✅ Gestion des erreurs appropriée
- ✅ Support complet du flow "Resource Owner Password Credentials"
