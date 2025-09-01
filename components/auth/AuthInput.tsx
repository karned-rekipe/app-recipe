/**
 * Composant d'input personnalisé pour les formulaires d'authentification
 */

import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  type TextInputProps 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  isPassword?: boolean;
  testID?: string;
}

export function AuthInput({ 
  label, 
  error, 
  isPassword = false, 
  testID,
  ...textInputProps 
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          {...textInputProps}
          testID={testID}
          style={styles.input}
          secureTextEntry={isPassword && !showPassword}
          placeholderTextColor={theme.colors.textSecondary}
          autoCapitalize={isPassword ? 'none' : textInputProps.autoCapitalize}
          autoCorrect={false}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
            accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            testID={`${testID}-visibility-toggle`}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 24,
    minHeight: 64,
    backdropFilter: 'blur(10px)',
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputError: {
    borderColor: theme.colors.error,
    backgroundColor: 'rgba(255, 245, 245, 0.95)',
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: theme.colors.text.primary,
    paddingVertical: 20,
  },
  eyeButton: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
});
