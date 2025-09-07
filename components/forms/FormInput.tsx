/**
 * Composant d'input réutilisable pour les formulaires
 * Basé sur AuthInput mais adapté pour les formulaires génériques
 */

import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  type TextInputProps 
} from 'react-native';
import { theme } from '../../constants/theme';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  required?: boolean;
  testID?: string;
}

export function FormInput({ 
  label, 
  error, 
  required = false,
  testID,
  ...textInputProps 
}: FormInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          {...textInputProps}
          testID={testID}
          style={styles.input}
          placeholderTextColor={theme.colors.text.placeholder}
          autoCorrect={false}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.white,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: theme.colors.text.primary,
    padding: 0,
  },
  inputError: {
    borderColor: theme.colors.error,
    borderWidth: 2,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
