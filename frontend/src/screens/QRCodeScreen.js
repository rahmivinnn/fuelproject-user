import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const QRCodeScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const qrData = JSON.stringify({
    orderId: order.id || '12345',
    orderNumber: order.orderNumber || 'FUEL-123456',
    stationId: order.station?.id || 'station-123',
    fuelType: order.fuelType || 'premium_gasoline',
    quantity: order.quantity || 10,
    timestamp: new Date().toISOString(),
  });

  const handleShare = () => {
    Alert.alert('Share QR Code', 'QR Code sharing functionality will be implemented');
  };

  const handleSave = () => {
    Alert.alert('Save QR Code', 'QR Code saving functionality will be implemented');
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        <Text style={styles.headerTitle}>QR Code</Text>
      </View>

      {/* QR Code Section */}
      <View style={styles.qrSection}>
        <Text style={styles.qrTitle}>Your Order QR Code</Text>
        <Text style={styles.qrSubtitle}>
          Show this QR code at the station for fuel pickup
        </Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={qrData}
            size={250}
            color={theme.colors.primary}
            backgroundColor={theme.colors.textLight}
            logoSize={30}
            logoMargin={2}
            logoBackgroundColor="transparent"
          />
        </View>

        <Text style={styles.qrCodeText}>
          Order #{order.orderNumber || 'FUEL-123456'}
        </Text>
      </View>

      {/* Order Details */}
      <View style={styles.orderDetails}>
        <Text style={styles.detailsTitle}>Order Details</Text>
        
        <View style={styles.detailItem}>
          <Icon name="local-gas-station" size={20} color={theme.colors.accent} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Station</Text>
            <Text style={styles.detailValue}>{order.station?.name || 'TurboFuel Express'}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Icon name="local-gas-station" size={20} color={theme.colors.accent} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Fuel Type</Text>
            <Text style={styles.detailValue}>
              {(order.fuelType || 'premium_gasoline').replace('_', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Icon name="straighten" size={20} color={theme.colors.accent} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{order.quantity || '10'} liters</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Icon name="schedule" size={20} color={theme.colors.accent} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Pickup Time</Text>
            <Text style={styles.detailValue}>Today, 12:30 AM</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Icon name="directions-car" size={20} color={theme.colors.accent} />
          <View style={styles.detailInfo}>
            <Text style={styles.detailLabel}>Vehicle</Text>
            <Text style={styles.detailValue}>
              {order.vehicle?.make || 'Honda'} {order.vehicle?.color || 'Red'} ({order.vehicle?.plate || 'CAN-1234'})
            </Text>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>How to Use</Text>
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>1</Text>
          </View>
          <Text style={styles.instructionText}>
            Arrive at the selected fuel station
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>2</Text>
          </View>
          <Text style={styles.instructionText}>
            Show this QR code to the station attendant
          </Text>
        </View>
        <View style={styles.instructionItem}>
          <View style={styles.instructionNumber}>
            <Text style={styles.instructionNumberText}>3</Text>
          </View>
          <Text style={styles.instructionText}>
            Collect your fuel and enjoy your order!
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="share" size={20} color={theme.colors.accent} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
          <Icon name="save" size={20} color={theme.colors.accent} />
          <Text style={styles.actionButtonText}>Save</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.trackButton}
          onPress={() => navigation.navigate('TrackOrder', { order })}
        >
          <Icon name="my-location" size={20} color={theme.colors.textLight} />
          <Text style={styles.trackButtonText}>Track Order</Text>
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
  qrSection: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.backgroundDark,
  },
  qrTitle: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  qrSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  qrContainer: {
    backgroundColor: theme.colors.textLight,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.lg,
  },
  qrCodeText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.accent,
  },
  orderDetails: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
  },
  detailsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  detailLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
  },
  instructions: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
  },
  instructionsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  instructionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  instructionNumberText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  instructionText: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.accent,
  },
  actionButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.lg,
  },
  trackButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.sm,
  },
});

export default QRCodeScreen;
