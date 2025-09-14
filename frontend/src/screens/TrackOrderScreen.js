import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const TrackOrderScreen = ({ route, navigation }) => {
  const { order } = route.params;

  const mapRegion = {
    latitude: 35.1495,
    longitude: -90.0490,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const routeCoordinates = [
    { latitude: 35.1495, longitude: -90.0490 },
    { latitude: 35.1500, longitude: -90.0480 },
    { latitude: 35.1505, longitude: -90.0470 },
    { latitude: 35.1510, longitude: -90.0460 },
  ];

  const renderMap = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Driver Location */}
        <Marker
          coordinate={routeCoordinates[0]}
          title="Driver Location"
          description="Cristopert Dastin"
        >
          <View style={styles.driverMarker}>
            <Icon name="person" size={20} color={theme.colors.textLight} />
          </View>
        </Marker>

        {/* Destination */}
        <Marker
          coordinate={routeCoordinates[routeCoordinates.length - 1]}
          title="Delivery Location"
        >
          <View style={styles.destinationMarker}>
            <Icon name="local-gas-station" size={20} color={theme.colors.textLight} />
          </View>
        </Marker>

        {/* Route Line */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor={theme.colors.accent}
          strokeWidth={3}
        />
      </MapView>
    </View>
  );

  const renderDriverInfo = () => (
    <View style={styles.driverInfoContainer}>
      <View style={styles.driverHeader}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/60x60/4ECDC4/FFFFFF?text=CD' }}
          style={styles.driverAvatar}
        />
        <View style={styles.driverDetails}>
          <Text style={styles.driverName}>Cristopert Dastin</Text>
          <Text style={styles.driverLocation}>Tennessee</Text>
        </View>
        <View style={styles.driverActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chat" size={20} color={theme.colors.accent} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="phone" size={20} color={theme.colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.deliveryTimeContainer}>
        <Text style={styles.deliveryTimeLabel}>Your Delivery Time</Text>
        <Text style={styles.deliveryTimeValue}>Estimated 8:30 - 9:15 PM</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.completedStep]}>
            <Icon name="person" size={16} color={theme.colors.textLight} />
          </View>
          <Text style={styles.progressText}>Order placed</Text>
        </View>
        
        <View style={styles.progressLine} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.completedStep]}>
            <Icon name="directions-car" size={16} color={theme.colors.textLight} />
          </View>
          <Text style={styles.progressText}>Driver en route</Text>
        </View>
        
        <View style={styles.progressLine} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.currentStep]}>
            <Icon name="local-gas-station" size={16} color={theme.colors.textLight} />
          </View>
          <Text style={styles.progressText}>At station</Text>
        </View>
        
        <View style={styles.progressLineInactive} />
        
        <View style={styles.progressStep}>
          <View style={[styles.progressIcon, styles.inactiveStep]}>
            <Icon name="check" size={16} color={theme.colors.textSecondary} />
          </View>
          <Text style={styles.progressText}>Delivered</Text>
        </View>
      </View>

      <View style={styles.orderDetailsContainer}>
        <Text style={styles.orderDetailsTitle}>Order</Text>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemName}>2 Liters Fuel</Text>
          <Text style={styles.orderItemPrice}>$283</Text>
        </View>
        <View style={styles.orderItem}>
          <Text style={styles.orderItemName}>2x Chocolate cookies</Text>
          <Text style={styles.orderItemPrice}>$20</Text>
        </View>
      </View>
    </View>
  );

  const renderBottomNavigation = () => (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity style={styles.navItem}>
        <Icon name="home" size={24} color={theme.colors.textSecondary} />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem}>
        <Icon name="business" size={24} color={theme.colors.textSecondary} />
        <Text style={styles.navText}>My Orders</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
        <Icon name="my-location" size={24} color={theme.colors.accent} />
        <Text style={[styles.navText, styles.activeNavText]}>Track Order</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem}>
        <Icon name="settings" size={24} color={theme.colors.textSecondary} />
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Track Your Order</Text>
      </View>

      {/* Map */}
      {renderMap()}

      {/* Driver Info */}
      {renderDriverInfo()}

      {/* Bottom Navigation */}
      {renderBottomNavigation()}
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
  mapContainer: {
    height: 300,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  driverMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destinationMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfoContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  driverAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  driverLocation: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  driverActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  deliveryTimeContainer: {
    marginBottom: theme.spacing.lg,
  },
  deliveryTimeLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  deliveryTimeValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  progressIcon: {
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
    backgroundColor: theme.colors.warning,
  },
  inactiveStep: {
    backgroundColor: theme.colors.textSecondary,
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.accent,
    marginHorizontal: theme.spacing.sm,
  },
  progressLineInactive: {
    width: 40,
    height: 2,
    backgroundColor: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  orderDetailsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  orderDetailsTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  orderItemName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  orderItemPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundSecondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  activeNavItem: {
    // Active state styling
  },
  navText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  activeNavText: {
    color: theme.colors.accent,
  },
});

export default TrackOrderScreen;
