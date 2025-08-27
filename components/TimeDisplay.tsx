import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import { formatTime } from '../utils/recipeHelpers';

interface TimeDisplayProps {
  minutes: number;
  variant?: 'default' | 'compact';
  size?: 'small' | 'medium' | 'large';
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({ 
  minutes, 
  variant = 'default',
  size = 'medium'
}) => {
  const getFormattedTime = () => {
    if (variant === 'compact') {
      // Format compact pour les cartes (ex: "45min", "1h30min")
      if (minutes < 60) {
        return `${minutes}min`;
      }
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`;
    }
    
    // Format par défaut (ex: "45 minutes", "1h30min")
    return formatTime(minutes);
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  return (
    <Text style={[styles.base, getSizeStyle()]}>
      {getFormattedTime()}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text.secondary,
    fontWeight: theme.fontWeight.semiBold,
  },
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: theme.fontSize.sm,
  },
  large: {
    fontSize: theme.fontSize.md,
  },
});
