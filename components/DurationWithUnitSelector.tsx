/**
 * Composant pour sélectionner une durée avec unité de temps
 * Respecte le principe SRP - responsable uniquement de la gestion des durées avec unités
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NumberSelector } from './NumberSelector';
import { theme } from '../constants/theme';

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';

interface TimeUnitConfig {
  label: string;
  maxValue: number;
  step: number;
  toMinutes: (value: number) => number;
  fromMinutes: (minutes: number) => number;
}

const TIME_UNITS: Record<TimeUnit, TimeUnitConfig> = {
  seconds: {
    label: 'seconde(s)',
    maxValue: 300, // 5 minutes max en secondes
    step: 15,
    toMinutes: (value) => Math.round(value / 60 * 100) / 100,
    fromMinutes: (minutes) => Math.round(minutes * 60),
  },
  minutes: {
    label: 'minute(s)',
    maxValue: 180, // 3 heures max en minutes
    step: 5,
    toMinutes: (value) => value,
    fromMinutes: (minutes) => Math.round(minutes),
  },
  hours: {
    label: 'heure(s)',
    maxValue: 72, // 3 jours max en heures
    step: 1,
    toMinutes: (value) => value * 60,
    fromMinutes: (minutes) => Math.round(minutes / 60),
  },
  days: {
    label: 'jour(s)',
    maxValue: 30, // 1 mois max en jours
    step: 1,
    toMinutes: (value) => value * 24 * 60,
    fromMinutes: (minutes) => Math.round(minutes / (24 * 60)),
  },
  weeks: {
    label: 'semaine(s)',
    maxValue: 8, // 2 mois max en semaines
    step: 1,
    toMinutes: (value) => value * 7 * 24 * 60,
    fromMinutes: (minutes) => Math.round(minutes / (7 * 24 * 60)),
  },
};

interface DurationWithUnitSelectorProps {
  value: number; // Valeur en minutes
  onValueChange: (minutes: number) => void;
  label?: string;
  defaultUnit?: TimeUnit;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function DurationWithUnitSelector({
  value,
  onValueChange,
  label,
  defaultUnit = 'minutes',
  disabled = false,
  size = 'small',
}: DurationWithUnitSelectorProps) {
  const [selectedUnit, setSelectedUnit] = useState<TimeUnit>(defaultUnit);
  const [displayValue, setDisplayValue] = useState(0);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  // Convertir les minutes en valeur d'affichage selon l'unité sélectionnée
  useEffect(() => {
    const unitConfig = TIME_UNITS[selectedUnit];
    const converted = Math.round(unitConfig.fromMinutes(value));
    setDisplayValue(converted);
  }, [value, selectedUnit]);

  // Déterminer automatiquement la meilleure unité basée sur la valeur en minutes
  const getBestUnit = (minutes: number): TimeUnit => {
    if (minutes === 0) return defaultUnit;
    if (minutes < 1) return 'seconds';
    if (minutes < 60) return 'minutes';
    if (minutes < 24 * 60) return 'hours';
    if (minutes < 7 * 24 * 60) return 'days';
    return 'weeks';
  };

  // Initialiser avec la meilleure unité si la valeur n'est pas 0
  useEffect(() => {
    if (value > 0 && selectedUnit === defaultUnit) {
      const bestUnit = getBestUnit(value);
      if (bestUnit !== selectedUnit) {
        setSelectedUnit(bestUnit);
      }
    }
  }, [value]);

  const handleValueChange = (newValue: number) => {
    const unitConfig = TIME_UNITS[selectedUnit];
    const minutesValue = unitConfig.toMinutes(newValue);
    onValueChange(Math.round(minutesValue));
  };

  const handleUnitChange = (newUnit: TimeUnit) => {
    setSelectedUnit(newUnit);
    setUnitModalVisible(false);
    // Convertir la valeur actuelle vers la nouvelle unité et arrondir à l'entier
    const newUnitConfig = TIME_UNITS[newUnit];
    const converted = Math.round(newUnitConfig.fromMinutes(value));
    setDisplayValue(converted);
    
    // Recalculer la valeur en minutes avec la nouvelle valeur arrondie pour éviter les décalages
    const adjustedMinutes = newUnitConfig.toMinutes(converted);
    onValueChange(Math.round(adjustedMinutes));
  };

  const currentUnitConfig = TIME_UNITS[selectedUnit];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.selectorContainer}>
        <View style={styles.numberContainer}>
          <NumberSelector
            value={displayValue}
            onValueChange={handleValueChange}
            minValue={0}
            maxValue={currentUnitConfig.maxValue}
            step={currentUnitConfig.step}
            size={size}
            disabled={disabled}
          />
        </View>
        
        <TouchableOpacity
          style={styles.unitButton}
          onPress={() => !disabled && setUnitModalVisible(true)}
          disabled={disabled}
        >
          <Text style={[styles.unitText, disabled && styles.disabledText]}>
            {currentUnitConfig.label}
          </Text>
          <Ionicons 
            name="chevron-down" 
            size={16} 
            color={disabled ? theme.colors.text.secondary : theme.colors.text.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Modal pour sélectionner l'unité */}
      <Modal
        visible={unitModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setUnitModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner une unité</Text>
              <TouchableOpacity
                onPress={() => setUnitModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.unitList}>
              {Object.entries(TIME_UNITS).map(([unit, config]) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitOption,
                    selectedUnit === unit && styles.selectedUnitOption
                  ]}
                  onPress={() => handleUnitChange(unit as TimeUnit)}
                >
                  <Text style={[
                    styles.unitOptionText,
                    selectedUnit === unit && styles.selectedUnitText
                  ]}>
                    {config.label}
                  </Text>
                  {selectedUnit === unit && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function formatDurationFromMinutes(minutes: number): string {
  if (minutes === 0) return '0 min';
  
  const weeks = Math.floor(minutes / (7 * 24 * 60));
  const days = Math.floor((minutes % (7 * 24 * 60)) / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = Math.round(minutes % 60);
  
  const parts = [];
  if (weeks > 0) parts.push(`${weeks}sem`);
  if (days > 0) parts.push(`${days}j`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}min`);
  
  return parts.slice(0, 2).join(' '); // Limiter à 2 unités pour la lisibilité
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  numberContainer: {
    flex: 1,
  },
  unitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minWidth: 120,
  },
  unitText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1,
  },
  disabledText: {
    color: theme.colors.text.secondary,
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.background.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background.white,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  unitList: {
    maxHeight: 300,
  },
  unitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectedUnitOption: {
    backgroundColor: theme.colors.background.overlayLight,
  },
  unitOptionText: {
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  selectedUnitText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
});
