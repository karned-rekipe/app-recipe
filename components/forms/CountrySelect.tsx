/**
 * Composant de sélection de pays avec drapeau et recherche
 * Respecte le principe SRP (Single Responsibility Principle)
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { getCountryInfo, getAllCountries } from '../../utils/countryFlags';

// Interface pour les données de pays
interface CountryData {
  name: string;
  flag: string;
}

// Interface pour les props du composant
interface CountrySelectProps {
  value?: string;
  onValueChange: (country: string) => void;
  placeholder?: string;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  style?: any;
}

// Liste des pays disponibles (importée depuis l'utilitaire)
const COUNTRIES = getAllCountries();

/**
 * Composant de sélection de pays avec recherche et affichage des drapeaux
 */
export function CountrySelect({
  value,
  onValueChange,
  placeholder = 'Sélectionner un pays',
  error,
  label,
  required = false,
  disabled = false,
  style,
}: CountrySelectProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Filtrage des pays en fonction de la recherche
  const filteredCountries = useMemo(() => {
    if (!searchText.trim()) {
      return COUNTRIES;
    }
    
    const lowercaseSearch = searchText.toLowerCase();
    return COUNTRIES.filter(country =>
      country.toLowerCase().includes(lowercaseSearch)
    );
  }, [searchText]);

  // Informations du pays sélectionné
  const selectedCountryInfo = useMemo(() => {
    return value ? getCountryInfo(value) : null;
  }, [value]);

  const handleCountrySelect = (country: string) => {
    onValueChange(country);
    setIsModalVisible(false);
    setSearchText('');
  };

  const openModal = () => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSearchText('');
  };

  const renderCountryItem = ({ item }: { item: string }) => {
    const countryInfo = getCountryInfo(item);
    if (!countryInfo) return null;

    return (
      <TouchableOpacity
        style={styles.countryItem}
        onPress={() => handleCountrySelect(item)}
      >
        <Text style={styles.countryFlag}>{countryInfo.flag}</Text>
        <Text style={styles.countryName}>{countryInfo.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      {/* Bouton de sélection */}
      <TouchableOpacity
        style={[
          styles.selectButton,
          error && styles.selectButtonError,
          disabled && styles.selectButtonDisabled,
        ]}
        onPress={openModal}
        disabled={disabled}
      >
        <View style={styles.selectButtonContent}>
          {selectedCountryInfo ? (
            <>
              <Text style={styles.selectedFlag}>{selectedCountryInfo.flag}</Text>
              <Text style={styles.selectedText}>{selectedCountryInfo.name}</Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={20}
          color={disabled ? theme.colors.text.placeholder : theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal de sélection */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Header du modal */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.cancelButton}>Annuler</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Sélectionner un pays</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un pays..."
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="words"
              autoComplete="country"
              autoCorrect={false}
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Liste des pays */}
          <FlatList
            data={filteredCountries}
            renderItem={renderCountryItem}
            keyExtractor={(item) => item}
            style={styles.countryList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        </SafeAreaView>
      </Modal>
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.white,
    minHeight: 48,
  },
  selectButtonError: {
    borderColor: theme.colors.error,
  },
  selectButtonDisabled: {
    backgroundColor: theme.colors.background.overlayLight,
    opacity: 0.6,
  },
  selectButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedFlag: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  selectedText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.text.placeholder,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background.white,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelButton: {
    fontSize: 16,
    color: theme.colors.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 60, // Pour équilibrer avec le bouton annuler
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background.white,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  clearButton: {
    marginLeft: theme.spacing.sm,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  countryName: {
    fontSize: 16,
    color: theme.colors.text.primary,
    flex: 1,
  },
});
