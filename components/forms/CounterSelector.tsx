/**
 * Composant générique de sélection avec boutons + et -
 * Respecte le principe de responsabilité unique (SRP)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../constants/theme';

interface CounterSelectorProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  disabled?: boolean;
  size?: 'large' | 'small';
  label?: string;
  error?: string;
}

export function CounterSelector({
  value,
  onValueChange,
  minValue = 1,
  maxValue = 99,
  step = 1,
  disabled = false,
  size = 'large',
  label,
  error
}: CounterSelectorProps) {
  const handleDecrease = () => {
    if (!disabled && value > minValue) {
      onValueChange(value - step);
    }
  };

  const handleIncrease = () => {
    if (!disabled && value < maxValue) {
      onValueChange(value + step);
    }
  };

  const isDecreaseDisabled = disabled || value <= minValue;
  const isIncreaseDisabled = disabled || value >= maxValue;

  const containerStyle = [
    styles.container,
    size === 'small' && styles.containerSmall,
    disabled && styles.containerDisabled
  ];

  const buttonStyle = [
    styles.button,
    size === 'small' && styles.buttonSmall,
  ];

  const countTextStyle = [
    styles.countText,
    size === 'small' && styles.countTextSmall,
    disabled && styles.textDisabled
  ];

  const buttonTextStyle = [
    styles.buttonText,
    size === 'small' && styles.buttonTextSmall,
  ];

  return (
    <View>
      <View style={containerStyle}>
        <TouchableOpacity 
          style={[
            buttonStyle,
            isDecreaseDisabled && styles.buttonDisabled
          ]}
          onPress={handleDecrease}
          disabled={isDecreaseDisabled}
          activeOpacity={0.7}
          accessibilityLabel="Diminuer"
          accessibilityRole="button"
        >
          <Text style={[
            buttonTextStyle,
            isDecreaseDisabled && styles.buttonTextDisabled
          ]}>
            −
          </Text>
        </TouchableOpacity>
        
        <View style={[
          styles.countContainer,
          size === 'small' && styles.countContainerSmall
        ]}>
          <Text style={countTextStyle}>{value}</Text>
          {label && (
            <Text style={[
              styles.labelText,
              size === 'small' && styles.labelTextSmall,
              disabled && styles.textDisabled
            ]}>
              {label}
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            buttonStyle,
            isIncreaseDisabled && styles.buttonDisabled
          ]}
          onPress={handleIncrease}
          disabled={isIncreaseDisabled}
          activeOpacity={0.7}
          accessibilityLabel="Augmenter"
          accessibilityRole="button"
        >
          <Text style={[
            buttonTextStyle,
            isIncreaseDisabled && styles.buttonTextDisabled
          ]}>
            +
          </Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  } as ViewStyle,
  containerSmall: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  } as ViewStyle,
  containerDisabled: {
    opacity: 0.6,
  } as ViewStyle,
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  buttonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  } as ViewStyle,
  buttonDisabled: {
    backgroundColor: theme.colors.text.secondary,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  } as ViewStyle,
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.background.white,
    lineHeight: 28,
  } as TextStyle,
  buttonTextSmall: {
    fontSize: 18,
    lineHeight: 20,
  } as TextStyle,
  buttonTextDisabled: {
    opacity: 0.7,
  } as TextStyle,
  countContainer: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.xl,
    minWidth: 100,
  } as ViewStyle,
  countContainerSmall: {
    marginHorizontal: theme.spacing.lg,
    minWidth: 60,
  } as ViewStyle,
  countText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
    textAlign: 'center',
  } as TextStyle,
  countTextSmall: {
    fontSize: 20,
    marginBottom: 1,
  } as TextStyle,
  labelText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  } as TextStyle,
  labelTextSmall: {
    fontSize: 12,
  } as TextStyle,
  textDisabled: {
    opacity: 0.6,
  } as TextStyle,
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  } as TextStyle,
});
