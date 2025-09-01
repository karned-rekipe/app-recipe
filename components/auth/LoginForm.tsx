/**
 * Composant formulaire de connexion
 * Gère la saisie des identifiants et la soumission du formulaire
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { useAuth } from '../../contexts/AuthContext';
import { theme } from '../../constants/theme';
import type { LoginCredentials } from '../../types/Auth';

interface LoginFormProps {
  onLoginSuccess?: () => void;
}

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { signIn, isLoading, error, clearError } = useAuth();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {};
    
    if (!credentials.username.trim()) {
      errors.username = 'Le nom d\'utilisateur est requis';
    }
    
    if (!credentials.password.trim()) {
      errors.password = 'Le mot de passe est requis';
    } else if (credentials.password.length < 3) {
      errors.password = 'Le mot de passe doit contenir au moins 3 caractères';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    setFieldErrors({});
    
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(credentials);
      
      // Réinitialiser le formulaire en cas de succès
      setCredentials({ username: '', password: '' });
      
      // Callback optionnel pour notifier le succès
      onLoginSuccess?.();
      
    } catch (authError: any) {
      // L'erreur est déjà gérée par le contexte
      console.error('Erreur de connexion:', authError);
      
      // Optionnel : afficher une alerte pour certaines erreurs
      if (authError.code === 'NETWORK_ERROR') {
        Alert.alert(
          'Problème de connexion',
          'Vérifiez votre connexion internet et réessayez.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleUsernameChange = (value: string) => {
    setCredentials(prev => ({ ...prev, username: value }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: undefined }));
    }
    // Effacer l'erreur générale aussi
    if (error) {
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setCredentials(prev => ({ ...prev, password: value }));
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: undefined }));
    }
    // Effacer l'erreur générale aussi
    if (error) {
      clearError();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Titre minimal */}
          <Text style={styles.title}>Connexion</Text>
          
          <View style={styles.form}>
            <AuthInput
              label=""
              value={credentials.username}
              onChangeText={handleUsernameChange}
              placeholder="Nom d'utilisateur"
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
              error={fieldErrors.username}
              testID="login-username-input"
            />

            <AuthInput
              label=""
              value={credentials.password}
              onChangeText={handlePasswordChange}
              placeholder="Mot de passe"
              isPassword
              autoComplete="password"
              textContentType="password"
              error={fieldErrors.password}
              testID="login-password-input"
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText} testID="login-error-message">
                  {error.message}
                </Text>
              </View>
            )}

            <AuthButton
              title="Se connecter"
              onPress={handleSubmit}
              loading={isLoading}
              testID="login-submit-button"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  formContainer: {
    width: '100%',
    alignSelf: 'stretch',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  form: {
    gap: 20,
    width: '100%',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 245, 245, 0.95)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
