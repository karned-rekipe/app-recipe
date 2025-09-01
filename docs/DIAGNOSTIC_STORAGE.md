# 🔧 Guide de Diagnostic - Erreur "Impossible de sauvegarder les tokens"

## 🚀 Tests de Diagnostic Rapides

### 1. **Test complet en une commande**
```javascript
authTests.runAllTests()
```

### 2. **Test spécifique du stockage**
```javascript
authTests.testDiagnosticTools()
```

### 3. **Diagnostic détaillé de la plateforme**
```javascript
diagnosisTest.runDiagnosis()
```

## 🔍 Interprétation des Résultats

### ✅ **Cas Normal (SecureStore fonctionne)**
```
✅ SecureStore fonctionne
✅ Tokens stockés avec SecureStore
```
**Solution** : Aucune, tout fonctionne correctement

### ⚠️ **SecureStore échoue, AsyncStorage fonctionne**
```
❌ SecureStore échoué: [erreur]
✅ AsyncStorage + chiffrement simple réussi
```
**Impact** : Sécurité légèrement réduite mais données persistantes
**Solution** : Normal, fallback sécurisé activé

### 🚨 **Tous les stockages échouent**
```
❌ SecureStore échoué: [erreur]
❌ AsyncStorage aussi échoué: [erreur]
```
**Solutions possibles** :

## 🛠️ Solutions par Type d'Erreur

### **Erreur: Permission denied**
- **Cause** : Permissions manquantes
- **Solution** : Redémarrer l'app ou vérifier les permissions

### **Erreur: Storage quota exceeded**
- **Cause** : Stockage plein
- **Solution** : Nettoyer le stockage de l'app

### **Erreur: Keychain/Keystore unavailable**
- **Cause** : Sécurité matérielle indisponible
- **Solution** : Le fallback AsyncStorage devrait marcher

### **Erreur: Network/Crypto unavailable**
- **Cause** : Bibliothèques crypto manquantes
- **Solution** : Utiliser la version sans chiffrement (temporaire)

## 🔧 Tests Spécifiques

### Test SecureStore uniquement :
```javascript
diagnosisTest.testSecureStore()
```

### Test AsyncStorage uniquement :
```javascript
diagnosisTest.testAsyncStorage()
```

### Test chiffrement uniquement :
```javascript
diagnosisTest.testSimpleEncryption()
```

## 📋 Informations à Collecter

Si le problème persiste, collectez ces infos :

```javascript
// Informations plateforme
console.log('Platform.OS:', Platform.OS);
console.log('Platform.Version:', Platform.Version);

// Test des services
diagnosisTest.testPlatformInfo();
```

## 🚑 Solution d'Urgence

Si tous les tests échouent, utilise cette version temporaire :

```javascript
// Dans la console, pour débloquer temporairement
localStorage.setItem('auth_access_token', 'your_token_here');
localStorage.setItem('auth_refresh_token', 'your_refresh_token_here');
```

**⚠️ Attention** : Cette solution n'est PAS sécurisée, uniquement pour débugger !

## 📞 Escalation

Si aucune solution ne fonctionne :
1. Exécuter `diagnosisTest.runDiagnosis()` 
2. Copier tous les logs
3. Noter la plateforme (iOS/Android/Web)
4. Noter la version d'Expo
5. Reporter le problème avec ces informations
