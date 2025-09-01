import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import { theme } from '../constants/theme';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Chargement...'
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});
