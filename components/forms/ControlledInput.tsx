/**
 * Composant d'input contrôlé utilisant React Hook Form
 */

import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet,
  TextInputProps 
} from 'react-native';
import { Control, Controller, FieldPath, FieldValues, RegisterOptions } from 'react-hook-form';
import { theme } from '../../constants/theme';

interface ControlledInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  name: TName;
  control: Control<TFieldValues>;
  label: string;
  rules?: RegisterOptions<TFieldValues, TName>;
  required?: boolean;
  error?: string;
}

export function ControlledInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  control,
  label,
  rules,
  required = false,
  error,
  ...textInputProps
}: ControlledInputProps<TFieldValues, TName>) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <>
            <TextInput
              style={[
                styles.input,
                (fieldError || error) && styles.inputError
              ]}
              value={value || ''}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholderTextColor={theme.colors.text.secondary}
              {...textInputProps}
            />
            {(fieldError || error) && (
              <Text style={styles.errorText}>
                {fieldError?.message || error}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  required: {
    color: theme.colors.error,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.white,
    minHeight: 48,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
