/**
 * Composant générique pour sélectionner un nombre avec des boutons + et -
 * Respecte le principe SRP - responsable uniquement de la sélection de nombres
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

interface NumberSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  label?: string;
  suffix?: string;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

/**
 * Composant pour sélectionner un nombre avec des boutons + et -
 */
export const NumberSelector: React.FC<NumberSelectorProps> = ({
  value,
  onValueChange,
  minValue = 0,
  maxValue = 999,
  step = 1,
  label,
  suffix,
  size = 'medium',
  disabled = false,
}) => {
  const handleDecrease = () => {
    if (!disabled && value > minValue) {
      const newValue = Math.max(minValue, value - step);
      onValueChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (!disabled && value < maxValue) {
      const newValue = Math.min(maxValue, value + step);
      onValueChange(newValue);
    }
  };

  const canDecrease = !disabled && value > minValue;
  const canIncrease = !disabled && value < maxValue;

  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.container, sizeStyles.container, disabled && styles.containerDisabled]}>
      <TouchableOpacity 
        style={[
          styles.button, 
          sizeStyles.button,
          !canDecrease && styles.buttonDisabled
        ]}
        onPress={handleDecrease}
        disabled={!canDecrease}
      >
        <Text style={[
          styles.buttonText, 
          sizeStyles.buttonText,
          !canDecrease && styles.buttonTextDisabled
        ]}>
          −
        </Text>
      </TouchableOpacity>
      
      <View style={[styles.valueContainer, sizeStyles.valueContainer]}>
        <Text style={[styles.valueText, sizeStyles.valueText]}>
          {Math.round(value)}{suffix ? ` ${suffix}` : ''}
        </Text>
        {label && (
          <Text style={[styles.label, sizeStyles.label]}>
            {label}
          </Text>
        )}
      </View>
      
      <TouchableOpacity 
        style={[
          styles.button,
          sizeStyles.button,
          !canIncrease && styles.buttonDisabled
        ]}
        onPress={handleIncrease}
        disabled={!canIncrease}
      >
        <Text style={[
          styles.buttonText,
          sizeStyles.buttonText,
          !canIncrease && styles.buttonTextDisabled
        ]}>
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        container: { marginVertical: theme.spacing.sm },
        button: { width: 32, height: 32, borderRadius: 16 },
        buttonText: { fontSize: 18, lineHeight: 20 },
        valueContainer: { minWidth: 60, marginHorizontal: theme.spacing.md },
        valueText: { fontSize: 16, fontWeight: '600' as const },
        label: { fontSize: 11 },
      };
    case 'large':
      return {
        container: { marginVertical: theme.spacing.xl },
        button: { width: 48, height: 48, borderRadius: 24 },
        buttonText: { fontSize: 28, lineHeight: 32 },
        valueContainer: { minWidth: 120, marginHorizontal: theme.spacing.xl },
        valueText: { fontSize: 32, fontWeight: '700' as const },
        label: { fontSize: 16 },
      };
    default: // medium
      return {
        container: { marginVertical: theme.spacing.md },
        button: { width: 40, height: 40, borderRadius: 20 },
        buttonText: { fontSize: 22, lineHeight: 24 },
        valueContainer: { minWidth: 80, marginHorizontal: theme.spacing.lg },
        valueText: { fontSize: 20, fontWeight: '600' as const },
        label: { fontSize: 13 },
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  containerDisabled: {
    opacity: 0.5,
  } as ViewStyle,
  button: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: theme.colors.text.secondary,
    opacity: 0.5,
  } as ViewStyle,
  buttonText: {
    fontWeight: '600',
    color: theme.colors.white,
  } as TextStyle,
  buttonTextDisabled: {
    color: theme.colors.white,
    opacity: 0.7,
  } as TextStyle,
  valueContainer: {
    alignItems: 'center',
  } as ViewStyle,
  valueText: {
    color: theme.colors.text.primary,
    marginBottom: 2,
  } as TextStyle,
  label: {
    color: theme.colors.text.secondary,
    fontWeight: '500',
  } as TextStyle,
});

export default NumberSelector;
