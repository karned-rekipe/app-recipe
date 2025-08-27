import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { layout, theme } from '../constants/theme';

interface CloseButtonProps {
  onPress: () => void;
  variant?: 'overlay' | 'light';
}

export const CloseButton: React.FC<CloseButtonProps> = ({ 
  onPress, 
  variant = 'overlay' 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.closeButton,
        variant === 'overlay' ? styles.overlayButton : styles.lightButton,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name="close"
        size={layout.closeButtonSize}
        color={variant === 'overlay' ? theme.colors.white : theme.colors.text.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: layout.closeButtonTop,
    right: layout.closeButtonRight,
    borderRadius: theme.borderRadius.md,
    padding: layout.closeButtonPadding,
    zIndex: 10,
  },
  overlayButton: {
    backgroundColor: theme.colors.background.overlay,
  },
  lightButton: {
    backgroundColor: theme.colors.background.overlayLight,
    ...theme.shadow.default,
  },
});
