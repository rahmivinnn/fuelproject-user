import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const FilterModal = ({ visible, onClose, filters, onApplyFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const fuelTypes = [
    'gasoline',
    'diesel',
    'electric',
    'lpg',
    'cng',
    'premium_gasoline',
    'premium_diesel'
  ];

  const brands = [
    'Shell',
    'BP',
    'Exxon',
    'Chevron',
    'Total',
    'Petronas',
    'Sinopec'
  ];

  const radiusOptions = [1, 5, 10, 15, 25, 50];

  const handleFuelTypeToggle = (fuelType) => {
    setLocalFilters(prev => ({
      ...prev,
      fuelType: prev.fuelType === fuelType ? null : fuelType
    }));
  };

  const handleBrandToggle = (brand) => {
    setLocalFilters(prev => ({
      ...prev,
      brand: prev.brand === brand ? null : brand
    }));
  };

  const handleRadiusChange = (radius) => {
    setLocalFilters(prev => ({
      ...prev,
      radius
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({
      fuelType: null,
      brand: null,
      radius: 10
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Filters</Text>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Fuel Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Fuel Type</Text>
              <View style={styles.optionsContainer}>
                {fuelTypes.map((fuelType) => (
                  <TouchableOpacity
                    key={fuelType}
                    style={[
                      styles.optionButton,
                      localFilters.fuelType === fuelType && styles.selectedOption
                    ]}
                    onPress={() => handleFuelTypeToggle(fuelType)}
                  >
                    <Text style={[
                      styles.optionText,
                      localFilters.fuelType === fuelType && styles.selectedOptionText
                    ]}>
                      {fuelType.replace('_', ' ').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Brand Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Brand</Text>
              <View style={styles.optionsContainer}>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.optionButton,
                      localFilters.brand === brand && styles.selectedOption
                    ]}
                    onPress={() => handleBrandToggle(brand)}
                  >
                    <Text style={[
                      styles.optionText,
                      localFilters.brand === brand && styles.selectedOptionText
                    ]}>
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Radius Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Search Radius</Text>
              <View style={styles.radiusContainer}>
                {radiusOptions.map((radius) => (
                  <TouchableOpacity
                    key={radius}
                    style={[
                      styles.radiusButton,
                      localFilters.radius === radius && styles.selectedRadius
                    ]}
                    onPress={() => handleRadiusChange(radius)}
                  >
                    <Text style={[
                      styles.radiusText,
                      localFilters.radius === radius && styles.selectedRadiusText
                    ]}>
                      {radius} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Filters */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Additional Options</Text>
              
              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Open Now</Text>
                <Switch
                  value={localFilters.openNow || false}
                  onValueChange={(value) => setLocalFilters(prev => ({
                    ...prev,
                    openNow: value
                  }))}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor={theme.colors.textLight}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Has EV Charging</Text>
                <Switch
                  value={localFilters.hasEVCharging || false}
                  onValueChange={(value) => setLocalFilters(prev => ({
                    ...prev,
                    hasEVCharging: value
                  }))}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor={theme.colors.textLight}
                />
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Has Convenience Store</Text>
                <Switch
                  value={localFilters.hasConvenienceStore || false}
                  onValueChange={(value) => setLocalFilters(prev => ({
                    ...prev,
                    hasConvenienceStore: value
                  }))}
                  trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
                  thumbColor={theme.colors.textLight}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: theme.colors.backgroundDark,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  resetText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.medium,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  optionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  selectedOption: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  optionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  selectedOptionText: {
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  radiusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  radiusButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  selectedRadius: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.accent,
  },
  radiusText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
  },
  selectedRadiusText: {
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  switchLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
  },
  applyButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.bold,
  },
});

export default FilterModal;
