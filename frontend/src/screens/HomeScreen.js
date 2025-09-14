import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchNearbyStations, setLocation } from '../store/slices/stationSlice';
import { fetchUserOrders } from '../store/slices/orderSlice';
import { theme } from '../styles/theme';
import LoadingSpinner from '../components/LoadingSpinner';
import StationCard from '../components/StationCard';
import OrderCard from '../components/OrderCard';
import QuickActionButton from '../components/QuickActionButton';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stations, isLoading: stationsLoading } = useAppSelector((state) => state.station);
  const { orders, isLoading: ordersLoading } = useAppSelector((state) => state.order);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getCurrentLocation();
    loadInitialData();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      });

      const { latitude, longitude } = position.coords;
      dispatch(setLocation({ latitude, longitude }));
      dispatch(fetchNearbyStations({ latitude, longitude, radius: 5 }));
    } catch (error) {
      console.error('Location error:', error);
      Alert.alert('Location Error', 'Unable to get your current location');
    }
  };

  const loadInitialData = () => {
    dispatch(fetchUserOrders({ limit: 5 }));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      getCurrentLocation(),
      loadInitialData(),
    ]);
    setRefreshing(false);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'findStations':
        navigation.navigate('Stations');
        break;
      case 'createOrder':
        navigation.navigate('CreateOrder');
        break;
      case 'viewOrders':
        navigation.navigate('Orders');
        break;
      case 'scanQR':
        navigation.navigate('QRCode');
        break;
    }
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        <QuickActionButton
          icon="location-on"
          title="Find Stations"
          onPress={() => handleQuickAction('findStations')}
        />
        <QuickActionButton
          icon="add-shopping-cart"
          title="Create Order"
          onPress={() => handleQuickAction('createOrder')}
        />
        <QuickActionButton
          icon="receipt"
          title="My Orders"
          onPress={() => handleQuickAction('viewOrders')}
        />
        <QuickActionButton
          icon="qr-code-scanner"
          title="Scan QR"
          onPress={() => handleQuickAction('scanQR')}
        />
      </View>
    </View>
  );

  const renderNearbyStations = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Nearby Stations</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Stations')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {stationsLoading ? (
        <LoadingSpinner />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {stations.slice(0, 5).map((station) => (
            <StationCard
              key={station._id}
              station={station}
              onPress={() => navigation.navigate('StationDetails', { stationId: station._id })}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );

  const renderRecentOrders = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {ordersLoading ? (
        <LoadingSpinner />
      ) : (
        <View>
          {orders.slice(0, 3).map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              onPress={() => navigation.navigate('OrderDetails', { orderId: order._id })}
            />
          ))}
          {orders.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="receipt" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyStateText}>No orders yet</Text>
              <Text style={styles.emptyStateSubtext}>Create your first fuel order</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.firstName || 'User'}!
        </Text>
        <Text style={styles.subtitleText}>
          Find and order fuel from nearby stations
        </Text>
      </View>

      {renderQuickActions()}
      {renderNearbyStations()}
      {renderRecentOrders()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
  },
  welcomeText: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  subtitleText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    opacity: 0.8,
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  seeAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.medium,
  },
  quickActionsContainer: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptyStateSubtext: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default HomeScreen;
