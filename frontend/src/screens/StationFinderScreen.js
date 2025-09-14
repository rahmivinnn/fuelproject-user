import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  fetchNearbyStations, 
  searchStations, 
  setLocation,
  setFilters,
  clearStations 
} from '../store/slices/stationSlice';
import { theme } from '../styles/theme';
import LoadingSpinner from '../components/LoadingSpinner';
import StationCard from '../components/StationCard';
import FilterModal from '../components/FilterModal';

// Set Mapbox access token
MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

const StationFinderScreen = () => {
  const dispatch = useAppDispatch();
  const { stations, isLoading, location, filters } = useAppSelector((state) => state.station);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (location.latitude && location.longitude) {
      loadStations();
    }
  }, [location, filters]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to find nearby fuel stations',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission Denied', 'Location permission is required to find nearby stations');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(setLocation({ latitude, longitude }));
      },
      (error) => {
        console.error('Location error:', error);
        Alert.alert('Location Error', 'Unable to get your current location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const loadStations = () => {
    if (searchQuery.trim()) {
      dispatch(searchStations({ 
        query: searchQuery, 
        latitude: location.latitude, 
        longitude: location.longitude 
      }));
    } else {
      dispatch(fetchNearbyStations({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: filters.radius,
        fuelType: filters.fuelType,
        brand: filters.brand,
      }));
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      dispatch(searchStations({ 
        query, 
        latitude: location.latitude, 
        longitude: location.longitude 
      }));
    } else {
      dispatch(clearStations());
      loadStations();
    }
  };

  const handleStationPress = (station) => {
    setSelectedStation(station);
    if (mapRef.current) {
      mapRef.current.flyTo([station.address.coordinates.longitude, station.address.coordinates.latitude], 1000);
    }
  };

  const handleMapPress = (feature) => {
    if (feature.properties) {
      const station = stations.find(s => s._id === feature.properties.stationId);
      if (station) {
        setSelectedStation(station);
      }
    }
  };

  const renderStationMarker = (station) => {
    const isSelected = selectedStation?._id === station._id;
    return (
      <MapboxGL.PointAnnotation
        key={station._id}
        id={station._id}
        coordinate={[station.address.coordinates.longitude, station.address.coordinates.latitude]}
        onSelected={() => handleStationPress(station)}
      >
        <View style={[
          styles.markerContainer,
          isSelected && styles.selectedMarker
        ]}>
          <Icon 
            name="local-gas-station" 
            size={24} 
            color={isSelected ? theme.colors.textLight : theme.colors.accent} 
          />
        </View>
      </MapboxGL.PointAnnotation>
    );
  };

  const renderStationList = () => (
    <View style={styles.listContainer}>
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {searchQuery ? 'Search Results' : 'Nearby Stations'} ({stations.length})
        </Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Icon name="filter-list" size={20} color={theme.colors.accent} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={stations}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <StationCard
              station={item}
              onPress={() => handleStationPress(item)}
              selected={selectedStation?._id === item._id}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search stations or locations..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Icon name="clear" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {location.latitude && location.longitude ? (
          <MapboxGL.MapView
            ref={mapRef}
            style={styles.map}
            styleURL={MapboxGL.StyleURL.Street}
            onPress={handleMapPress}
          >
            <MapboxGL.Camera
              centerCoordinate={[location.longitude, location.latitude]}
              zoomLevel={12}
              animationDuration={1000}
            />
            
            {/* User location */}
            <MapboxGL.PointAnnotation
              id="userLocation"
              coordinate={[location.longitude, location.latitude]}
            >
              <View style={styles.userLocationMarker}>
                <Icon name="my-location" size={20} color={theme.colors.primary} />
              </View>
            </MapboxGL.PointAnnotation>

            {/* Station markers */}
            {stations.map(renderStationMarker)}
          </MapboxGL.MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <LoadingSpinner />
            <Text style={styles.mapPlaceholderText}>Loading map...</Text>
          </View>
        )}
      </View>

      {/* Station List */}
      {renderStationList()}

      {/* Filter Modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApplyFilters={(newFilters) => {
          dispatch(setFilters(newFilters));
          setShowFilters(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
  },
  mapContainer: {
    flex: 1,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
  },
  mapPlaceholderText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent,
    ...theme.shadows.sm,
  },
  selectedMarker: {
    backgroundColor: theme.colors.accent,
    borderColor: theme.colors.primary,
  },
  userLocationMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  listContainer: {
    height: 300,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.text,
  },
  filterButton: {
    padding: theme.spacing.sm,
  },
});

export default StationFinderScreen;
