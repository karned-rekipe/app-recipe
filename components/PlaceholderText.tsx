import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

interface PlaceholderTextProps {
  text: string;
}

export const PlaceholderText: React.FC<PlaceholderTextProps> = ({ text }) => {
  return <Text style={styles.placeholderText}>{text}</Text>;
};

const styles = StyleSheet.create({
  placeholderText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.placeholder,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
