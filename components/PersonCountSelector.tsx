import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../constants/theme';

interface PersonCountSelectorProps {
  initialCount: number;
  onCountChange?: (count: number) => void;
  minCount?: number;
  maxCount?: number;
}

/**
 * Composant pour sélectionner le nombre de personnes avec des boutons + et -
 */
export const PersonCountSelector: React.FC<PersonCountSelectorProps> = ({
  initialCount,
  onCountChange,
  minCount = 1,
  maxCount = 20,
}) => {
  const [count, setCount] = useState(initialCount);

  const handleDecrease = () => {
    if (count > minCount) {
      const newCount = count - 1;
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };

  const handleIncrease = () => {
    if (count < maxCount) {
      const newCount = count + 1;
      setCount(newCount);
      onCountChange?.(newCount);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, count <= minCount && styles.buttonDisabled]}
        onPress={handleDecrease}
        disabled={count <= minCount}
      >
        <Text style={[styles.buttonText, count <= minCount && styles.buttonTextDisabled]}>−</Text>
      </TouchableOpacity>
      
      <View style={styles.countContainer}>
        <Text style={styles.countText}>{count}</Text>
        <Text style={styles.countLabel}>personne{count > 1 ? 's' : ''}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.button, count >= maxCount && styles.buttonDisabled]}
        onPress={handleIncrease}
        disabled={count >= maxCount}
      >
        <Text style={[styles.buttonText, count >= maxCount && styles.buttonTextDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
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
  buttonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  } as ViewStyle,
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.white,
    lineHeight: 28,
  } as TextStyle,
  buttonTextDisabled: {
    color: theme.colors.white,
    opacity: 0.7,
  } as TextStyle,
  countContainer: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.xl,
    minWidth: 100,
  } as ViewStyle,
  countText: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginBottom: 2,
  } as TextStyle,
  countLabel: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  } as TextStyle,
});

export default PersonCountSelector;
