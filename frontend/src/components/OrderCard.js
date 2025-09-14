import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const OrderCard = ({ order, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (amount, currency = 'USD') => {
    return `$${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'confirmed':
        return theme.colors.info;
      case 'preparing':
        return theme.colors.info;
      case 'ready':
        return theme.colors.success;
      case 'completed':
        return theme.colors.success;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'confirmed':
        return 'check-circle-outline';
      case 'preparing':
        return 'build';
      case 'ready':
        return 'done';
      case 'completed':
        return 'check-circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help-outline';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
          <Text style={styles.stationName}>{order.station?.name || 'Unknown Station'}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Icon 
            name={getStatusIcon(order.status)} 
            size={20} 
            color={getStatusColor(order.status)} 
          />
          <Text style={[styles.status, { color: getStatusColor(order.status) }]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.fuelInfo}>
          <Text style={styles.fuelType}>
            {order.fuelType?.replace('_', ' ').toUpperCase()}
          </Text>
          <Text style={styles.quantity}>
            {order.quantity} {order.unit}
          </Text>
        </View>

        <View style={styles.pricingInfo}>
          <Text style={styles.totalAmount}>
            {formatPrice(order.pricing?.totalAmount, order.pricing?.currency)}
          </Text>
          <Text style={styles.scheduledTime}>
            {formatDate(order.pickup?.scheduledTime)}
          </Text>
        </View>
      </View>

      {order.addOns && order.addOns.length > 0 && (
        <View style={styles.addOnsContainer}>
          <Icon name="add" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.addOnsText}>
            {order.addOns.length} add-on(s)
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.loyaltyContainer}>
          <Icon name="star" size={16} color={theme.colors.warning} />
          <Text style={styles.loyaltyText}>
            +{order.loyaltyPoints?.earned || 0} points
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Icon name="chevron-right" size={20} color={theme.colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  stationName: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  fuelInfo: {
    flex: 1,
  },
  fuelType: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text,
  },
  quantity: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  pricingInfo: {
    alignItems: 'flex-end',
  },
  totalAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  scheduledTime: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addOnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.sm,
  },
  addOnsText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loyaltyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loyaltyText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  arrowContainer: {
    padding: theme.spacing.xs,
  },
});

export default OrderCard;
