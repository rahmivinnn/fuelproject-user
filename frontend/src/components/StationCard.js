import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const StationCard = ({ station, onPress, selected = false }) => {
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  const formatPrice = (price, currency = 'USD') => {
    return `$${price.toFixed(2)}`;
  };

  const getFuelPrice = (fuelType) => {
    const fuel = station.fuelTypes?.find(f => f.type === fuelType && f.isAvailable);
    return fuel ? formatPrice(fuel.price, fuel.currency) : 'N/A';
  };

  const isOpen = station.isOpen ? station.isOpen() : false;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.selectedContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>{station.brand}</Text>
          <Text style={styles.stationName}>{station.name}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: isOpen ? theme.colors.success : theme.colors.error }
          ]} />
          <Text style={styles.statusText}>
            {isOpen ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.address} numberOfLines={1}>
            {station.address.street}, {station.address.city}
          </Text>
        </View>

        {station.distance && (
          <View style={styles.distanceContainer}>
            <Icon name="directions" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.distance}>
              {formatDistance(station.distance)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.fuelPrices}>
        {station.fuelTypes?.slice(0, 3).map((fuel) => (
          <View key={fuel.type} style={styles.fuelPriceItem}>
            <Text style={styles.fuelType}>
              {fuel.type.replace('_', ' ').toUpperCase()}
            </Text>
            <Text style={styles.fuelPrice}>
              {fuel.isAvailable ? formatPrice(fuel.price, fuel.currency) : 'N/A'}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color={theme.colors.warning} />
          <Text style={styles.rating}>
            {station.rating?.average?.toFixed(1) || 'N/A'}
          </Text>
          <Text style={styles.ratingCount}>
            ({station.rating?.count || 0})
          </Text>
        </View>

        {station.services && station.services.length > 0 && (
          <View style={styles.servicesContainer}>
            <Icon name="local-convenience-store" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.servicesText}>
              {station.services.length} services
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  selectedContainer: {
    borderColor: theme.colors.accent,
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  brandContainer: {
    flex: 1,
  },
  brandName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
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
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  statusText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  fuelPrices: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.md,
  },
  fuelPriceItem: {
    alignItems: 'center',
  },
  fuelType: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  fuelPrice: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
  },
  ratingCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  servicesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicesText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});

export default StationCard;
