import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLicense } from '../hooks/useLicense';
import type { License } from '../types/License';

interface LicenseInfoProps {
  onLicenseChange?: (license: License) => void;
}

export function LicenseInfo({ onLicenseChange }: LicenseInfoProps) {
  const { licenses, activeLicense, setActiveLicense, formatExpirationDate, isLicenseExpired } = useLicense();

  const handleLicenseSelect = (license: License) => {
    if (isLicenseExpired(license)) {
      Alert.alert(
        'Licence expirée',
        'Cette licence a expiré et ne peut pas être sélectionnée.',
        [{ text: 'OK' }]
      );
      return;
    }

    setActiveLicense(license);
    onLicenseChange?.(license);
  };

  if (licenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Licences</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune licence trouvée</Text>
          <Text style={styles.emptySubtext}>Contactez votre administrateur pour obtenir une licence.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Licences ({licenses.length})</Text>
      <ScrollView style={styles.licensesContainer} showsVerticalScrollIndicator={false}>
        {licenses.map((license) => {
          const expired = isLicenseExpired(license);
          const isActive = activeLicense?.uuid === license.uuid;
          
          return (
            <TouchableOpacity
              key={license.uuid}
              style={[
                styles.licenseCard,
                isActive && styles.activeLicenseCard,
                expired && styles.expiredLicenseCard
              ]}
              onPress={() => handleLicenseSelect(license)}
              disabled={expired}
            >
              <View style={styles.licenseHeader}>
                <Text style={[
                  styles.licenseName,
                  isActive && styles.activeLicenseText,
                  expired && styles.expiredLicenseText
                ]}>
                  {license.name}
                </Text>
                {isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
                {expired && (
                  <View style={styles.expiredBadge}>
                    <Text style={styles.expiredBadgeText}>Expirée</Text>
                  </View>
                )}
              </View>
              
              <Text style={styles.licenseExpiry}>
                Expire le {formatExpirationDate(license)}
              </Text>
              
              {license.api_roles['api-recipe'] && (
                <View style={styles.permissionsContainer}>
                  <Text style={styles.permissionsTitle}>Permissions recettes :</Text>
                  <View style={styles.permissionsList}>
                    {license.api_roles['api-recipe'].roles.map((role) => (
                      <View key={role} style={styles.permissionBadge}>
                        <Text style={styles.permissionText}>{role}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              
              {license.auto_renew && (
                <Text style={styles.autoRenewText}>✓ Renouvellement automatique</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  licensesContainer: {
    flex: 1,
  },
  licenseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeLicenseCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f8fff8',
  },
  expiredLicenseCard: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  licenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  licenseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  activeLicenseText: {
    color: '#4CAF50',
  },
  expiredLicenseText: {
    color: '#999',
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  expiredBadge: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expiredBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  licenseExpiry: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  permissionsContainer: {
    marginTop: 8,
  },
  permissionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  permissionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  permissionBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  permissionText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '500',
  },
  autoRenewText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
    marginTop: 8,
  },
});
