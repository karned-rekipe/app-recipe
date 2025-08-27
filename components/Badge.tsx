import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface BadgeProps {
  text: string;
  backgroundColor: string;
}

export const Badge: React.FC<BadgeProps> = ({ text, backgroundColor }) => {
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs + 2, // 6px
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    textTransform: 'capitalize',
  },
});
