import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const OrderSummaryScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const orderDetails = [
    { label: 'Station Name', value: 'TurboFuel Express' },
    { label: 'Fuel Type', value: 'Premium Gasoline' },
    { label: 'Quantity', value: '10 liters' },
    { label: 'Chocolate Cookies', value: '$20.00' },
    { label: 'Delivery Time', value: 'Today, 12:30 AM' },
    { label: 'Vehicle Brand', value: 'Honda' },
    { label: 'Vehicle color', value: 'Red' },
    { label: 'License Number', value: 'CAN-1234' },
    { label: 'Fuel Cost', value: '$90.00' },
    { label: 'Delivery Fee', value: '$10.00' },
    { label: 'Total Amount', value: '$120.00' },
  ];

  const renderProgressSteps = () => (
    <View style={styles.progressContainer}>
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, styles.completedStep]}>
          <Icon name="check" size={16} color={theme.colors.textLight} />
        </View>
        <Text style={[styles.stepText, styles.completedStepText]}>Order</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, styles.currentStep]}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <Text style={[styles.stepText, styles.currentStepText]}>Order summary</Text>
      </View>
      
      <View style={styles.stepLineInactive} />
      
      <View style={styles.stepContainer}>
        <View style={[styles.stepCircle, styles.inactiveStep]}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={[styles.stepText, styles.inactiveStepText]}>Payment</Text>
      </View>
    </View>
  );

  const renderOrderDetails = () => (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>Fuel order details</Text>
      {orderDetails.map((detail, index) => (
        <View key={index} style={styles.detailItem}>
          <Text style={styles.detailLabel}>{detail.label}</Text>
          <Text style={styles.detailValue}>{detail.value}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={theme.colors.textLight} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order summary</Text>
      </View>

      {/* Progress Steps */}
      {renderProgressSteps()}

      {/* Order Details */}
      <ScrollView style={styles.content}>
        {renderOrderDetails()}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={() => navigation.navigate('Payment')}
        >
          <Text style={styles.confirmButtonText}>Confirm Payment & Address</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  completedStep: {
    backgroundColor: theme.colors.accent,
  },
  currentStep: {
    backgroundColor: theme.colors.accent,
  },
  inactiveStep: {
    backgroundColor: theme.colors.textSecondary,
  },
  stepNumber: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.accent,
    marginHorizontal: theme.spacing.sm,
  },
  stepLineInactive: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm,
  },
  stepText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
  },
  completedStepText: {
    color: theme.colors.accent,
  },
  currentStepText: {
    color: theme.colors.accent,
  },
  inactiveStepText: {
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  detailsContainer: {
    backgroundColor: theme.colors.backgroundDark,
  },
  detailsTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    flex: 1,
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    textAlign: 'right',
  },
  bottomActions: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
  },
  confirmButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  confirmButtonText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  editButton: {
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.medium,
  },
});

export default OrderSummaryScreen;
