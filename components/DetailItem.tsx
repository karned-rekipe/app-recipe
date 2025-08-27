import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface DetailItemProps {
  icon?: ReactNode;
  text: string | ReactNode;
  justify?: 'flex-start' | 'space-between' | 'center';
}

export const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  text,
  justify = 'space-between',
}) => {
  return (
    <View style={[styles.container, { justifyContent: justify }]}>
      {icon}
      {typeof text === 'string' ? (
        <Text style={styles.text}>{text}</Text>
      ) : (
        text
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  text: {
    fontSize: theme.fontSize.md,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
});
