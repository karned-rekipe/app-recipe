/**
 * Bouton d'action flottant (FAB - Floating Action Button)
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  size?: number;
  style?: ViewStyle;
  testID?: string;
}

export function FloatingActionButton({ 
  onPress, 
  icon = 'add', 
  size = 24,
  style,
  testID 
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.fab, style]}
      onPress={onPress}
      testID={testID}
      activeOpacity={0.8}
    >
      <Ionicons 
        name={icon} 
        size={size} 
        color={theme.colors.white} 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Android
    shadowColor: theme.colors.shadow.color, // iOS
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: theme.colors.shadow.opacity,
    shadowRadius: 8,
    zIndex: 1000,
  },
});
