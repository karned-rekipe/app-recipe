/**
 * Composant de bouton personnalisé pour les formulaires d'authentification
 */

import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  type TouchableOpacityProps 
} from 'react-native';
import { theme } from '../../constants/theme';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  fullWidth?: boolean;
  testID?: string;
}

export function AuthButton({ 
  title, 
  variant = 'primary', 
  loading = false, 
  fullWidth = true,
  disabled,
  testID,
  ...touchableOpacityProps 
}: AuthButtonProps) {
  const isDisabled = disabled || loading;
  
  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      testID={testID}
      style={[
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        touchableOpacityProps.style,
      ]}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? theme.colors.white : theme.colors.primary} 
          testID={`${testID}-loading`}
        />
      ) : (
        <Text 
          style={[styles.text, styles[`${variant}Text`]]}
          testID={`${testID}-text`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: theme.colors.white,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
});
