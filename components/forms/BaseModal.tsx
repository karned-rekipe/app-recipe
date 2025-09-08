/**
 * Composant de base pour les modales avec logique commune
 * Respecte le principe SRP - responsable uniquement de la structure de base des modales
 */

import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface BaseModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onSave: () => void;
  isValid: boolean;
  saveButtonText?: string;
  children: React.ReactNode;
}

export function BaseModal({
  visible,
  title,
  onCancel,
  onSave,
  isValid,
  saveButtonText = 'Ajouter',
  children,
}: BaseModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={onSave}
              disabled={!isValid}
              style={[styles.saveButton, !isValid && styles.disabledButton]}
            >
              <Text style={[styles.saveButtonText, !isValid && styles.disabledText]}>
                {saveButtonText}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {children}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: theme.colors.background.white,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  saveButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: theme.colors.text.secondary,
  },
  disabledText: {
    color: theme.colors.text.placeholder,
  },
  form: {
    padding: theme.spacing.md,
  },
});
