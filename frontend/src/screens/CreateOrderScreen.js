import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const CreateOrderScreen = ({ route, navigation }) => {
  const { station } = route.params;
  const [selectedFuelType, setSelectedFuelType] = useState('gasoline');
  const [quantity, setQuantity] = useState('10');
  const [scheduledTime, setScheduledTime] = useState('Today, 12:30 AM');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [addOns, setAddOns] = useState([]);

  const fuelTypes = [
    { id: 'gasoline', name: 'Regular Gasoline', price: 1.23 },
    { id: 'premium_gasoline', name: 'Premium Gasoline', price: 1.75 },
    { id: 'diesel', name: 'Diesel', price: 2.14 },
  ];

  const vehicles = [
    { id: 1, make: 'Honda', model: 'Civic', year: 2020, color: 'Red', plate: 'CAN-1234' },
    { id: 2, make: 'Toyota', model: 'Camry', year: 2019, color: 'Blue', plate: 'CAN-5678' },
  ];

  const availableAddOns = [
    { id: 1, name: 'Chocolate Cookies', price: 20.00, image: 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=Cookies' },
    { id: 2, name: 'Car Wash', price: 15.00, image: 'https://via.placeholder.com/60x60/4ECDC4/FFFFFF?text=Wash' },
    { id: 3, name: 'Air Pump', price: 5.00, image: 'https://via.placeholder.com/60x60/45B7D1/FFFFFF?text=Air' },
  ];

  const handleFuelTypeSelect = (fuelType) => {
    setSelectedFuelType(fuelType.id);
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleAddOnToggle = (addOn) => {
    setAddOns(prev => {
      const exists = prev.find(item => item.id === addOn.id);
      if (exists) {
        return prev.filter(item => item.id !== addOn.id);
      } else {
        return [...prev, addOn];
      }
    });
  };

  const calculateTotal = () => {
    const fuelPrice = fuelTypes.find(f => f.id === selectedFuelType)?.price || 0;
    const fuelTotal = fuelPrice * parseFloat(quantity);
    const addOnsTotal = addOns.reduce((sum, addOn) => sum + addOn.price, 0);
    const deliveryFee = 10.00;
    return fuelTotal + addOnsTotal + deliveryFee;
  };

  const handleContinue = () => {
    if (!selectedVehicle) {
      Alert.alert('Error', 'Please select a vehicle');
      return;
    }

    const orderData = {
      station,
      fuelType: selectedFuelType,
      quantity: parseFloat(quantity),
      scheduledTime,
      vehicle: selectedVehicle,
      addOns,
      total: calculateTotal(),
    };

    navigation.navigate('OrderSummary', { order: orderData });
  };

  const renderFuelTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Fuel Type</Text>
      {fuelTypes.map((fuelType) => (
        <TouchableOpacity
          key={fuelType.id}
          style={[
            styles.fuelTypeItem,
            selectedFuelType === fuelType.id && styles.selectedFuelType
          ]}
          onPress={() => handleFuelTypeSelect(fuelType)}
        >
          <View style={styles.fuelTypeInfo}>
            <Text style={styles.fuelTypeName}>{fuelType.name}</Text>
            <Text style={styles.fuelTypePrice}>${fuelType.price.toFixed(2)} per liter</Text>
          </View>
          <View style={styles.radioButton}>
            {selectedFuelType === fuelType.id && (
              <View style={styles.radioButtonSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quantity (Liters)</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, parseFloat(quantity) - 1).toString())}
        >
          <Icon name="remove" size={20} color={theme.colors.textLight} />
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          textAlign="center"
        />
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => setQuantity((parseFloat(quantity) + 1).toString())}
        >
          <Icon name="add" size={20} color={theme.colors.textLight} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVehicleSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Vehicle</Text>
      {vehicles.map((vehicle) => (
        <TouchableOpacity
          key={vehicle.id}
          style={[
            styles.vehicleItem,
            selectedVehicle?.id === vehicle.id && styles.selectedVehicle
          ]}
          onPress={() => handleVehicleSelect(vehicle)}
        >
          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model} ({vehicle.year})</Text>
            <Text style={styles.vehicleDetails}>{vehicle.color}  {vehicle.plate}</Text>
          </View>
          <View style={styles.radioButton}>
            {selectedVehicle?.id === vehicle.id && (
              <View style={styles.radioButtonSelected} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAddOns = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Add-ons (Optional)</Text>
      {availableAddOns.map((addOn) => (
        <TouchableOpacity
          key={addOn.id}
          style={styles.addOnItem}
          onPress={() => handleAddOnToggle(addOn)}
        >
          <View style={styles.addOnImage}>
            <Icon name="local-grocery-store" size={24} color={theme.colors.textLight} />
          </View>
          <View style={styles.addOnInfo}>
            <Text style={styles.addOnName}>{addOn.name}</Text>
            <Text style={styles.addOnPrice}>${addOn.price.toFixed(2)}</Text>
          </View>
          <View style={styles.checkbox}>
            {addOns.find(item => item.id === addOn.id) && (
              <Icon name="check" size={16} color={theme.colors.accent} />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOrderSummary = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Fuel Cost</Text>
          <Text style={styles.summaryValue}>
            ${(fuelTypes.find(f => f.id === selectedFuelType)?.price || 0 * parseFloat(quantity)).toFixed(2)}
          </Text>
        </View>
        {addOns.map((addOn) => (
          <View key={addOn.id} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{addOn.name}</Text>
            <Text style={styles.summaryValue}>${addOn.price.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$10.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderFuelTypeSelector()}
      {renderQuantitySelector()}
      {renderVehicleSelector()}
      {renderAddOns()}
      {renderOrderSummary()}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue to Order Summary</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  section: {
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  fuelTypeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedFuelType: {
    borderColor: theme.colors.accent,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  fuelTypeInfo: {
    flex: 1,
  },
  fuelTypeName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  fuelTypePrice: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.accent,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityInput: {
    width: 80,
    height: 40,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.md,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  vehicleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedVehicle: {
    borderColor: theme.colors.accent,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  vehicleDetails: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  addOnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  addOnImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  addOnInfo: {
    flex: 1,
  },
  addOnName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  addOnPrice: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: theme.spacing.md,
  },
  summaryLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
  },
  totalLabel: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  totalValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
  },
  continueButton: {
    backgroundColor: theme.colors.accent,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
});

export default CreateOrderScreen;
