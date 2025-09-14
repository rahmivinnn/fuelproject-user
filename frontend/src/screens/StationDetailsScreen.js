import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { theme } from '../styles/theme';

const StationDetailsScreen = ({ route, navigation }) => {
  const { station } = route.params;

  const renderFuelPrices = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fuel Prices</Text>
      <View style={styles.fuelPricesContainer}>
        <View style={styles.fuelPriceItem}>
          <Text style={styles.fuelType}>Regular</Text>
          <Text style={styles.fuelPrice}>$1.23 per liter</Text>
        </View>
        <View style={styles.fuelPriceItem}>
          <Text style={styles.fuelType}>Premium</Text>
          <Text style={styles.fuelPrice}>$1.75 per liter</Text>
        </View>
        <View style={styles.fuelPriceItem}>
          <Text style={styles.fuelType}>Diesel</Text>
          <Text style={styles.fuelPrice}>$2.14 per liter</Text>
        </View>
      </View>
    </View>
  );

  const renderStationInfo = () => (
    <View style={styles.section}>
      <View style={styles.infoItem}>
        <Icon name="location-on" size={20} color={theme.colors.error} />
        <Text style={styles.infoText}>Distance: 2.7 miles away</Text>
      </View>
      <View style={styles.infoItem}>
        <Icon name="access-time" size={20} color={theme.colors.warning} />
        <Text style={styles.infoText}>Average Delivery time: 30 minutes</Text>
      </View>
      <View style={styles.infoItem}>
        <Icon name="star" size={20} color={theme.colors.warning} />
        <Text style={styles.infoText}>
          4.7 Rating <Text style={styles.reviewCount}>(146 reviews)</Text>
        </Text>
      </View>
    </View>
  );

  const renderGroceries = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Groceries</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[1, 2, 3].map((item, index) => (
          <View key={index} style={styles.groceryItem}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/80x80/FF6B6B/FFFFFF?text=Snacks' }}
              style={styles.groceryImage}
            />
            <Text style={styles.groceryName}>Snacks</Text>
            <Text style={styles.groceryPrice}>$16.19</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity style={styles.quantityButton}>
                <Icon name="remove" size={16} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>1</Text>
              <TouchableOpacity style={styles.quantityButton}>
                <Icon name="add" size={16} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Icon name="delete" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderFuelFriends = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Select Fuel friend</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.fuelFriendsGrid}>
        {[1, 2, 3, 4].map((friend, index) => (
          <View key={index} style={styles.fuelFriendItem}>
            <Image 
              source={{ 
                uri: index % 2 === 0 
                  ? 'https://via.placeholder.com/60x60/FF6B6B/FFFFFF?text=SH' 
                  : 'https://via.placeholder.com/60x60/4ECDC4/FFFFFF?text=SH'
              }}
              style={styles.friendAvatar}
            />
            <Text style={styles.friendName}>Shah Hussain</Text>
            <Text style={styles.friendAmount}>$05.00</Text>
            <View style={styles.friendInfo}>
              <Icon name="location-on" size={14} color={theme.colors.error} />
              <Text style={styles.friendLocation}>Tennessee</Text>
            </View>
            <View style={styles.friendRating}>
              <Icon name="star" size={14} color={theme.colors.warning} />
              <Text style={styles.friendRatingText}>
                4.8 <Text style={styles.reviewCount}>(46 reviews)</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>Select</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Station Header Image */}
      <View style={styles.stationImageContainer}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Gas+Station' }}
          style={styles.stationImage}
        />
        <View style={styles.stationLogo}>
          <View style={styles.logoContainer}>
            <Icon name="local-gas-station" size={24} color={theme.colors.textLight} />
            <Text style={styles.logoText}>ROYAL 400</Text>
            <Text style={styles.logoSubtext}>GASOLINE</Text>
          </View>
        </View>
      </View>

      {/* Station Name and Location */}
      <View style={styles.stationInfo}>
        <Text style={styles.stationName}>Petro Tennessee</Text>
        <View style={styles.locationContainer}>
          <Icon name="location-on" size={16} color={theme.colors.error} />
          <Text style={styles.locationText}>Abcd Tennessee</Text>
        </View>
      </View>

      {/* Fuel Prices */}
      {renderFuelPrices()}

      {/* Station Information */}
      {renderStationInfo()}

      {/* Groceries */}
      {renderGroceries()}

      {/* Fuel Friends */}
      {renderFuelFriends()}

      {/* View More */}
      <TouchableOpacity style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>

      {/* Order Now Button */}
      <TouchableOpacity style={styles.orderNowButton}>
        <Text style={styles.orderNowText}>Order Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundDark,
  },
  stationImageContainer: {
    position: 'relative',
    height: 200,
  },
  stationImage: {
    width: '100%',
    height: '100%',
  },
  stationLogo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: theme.colors.textLight,
  },
  logoText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  logoSubtext: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textLight,
  },
  stationInfo: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.backgroundDark,
  },
  stationName: {
    fontSize: theme.fontSize.xxl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  section: {
    backgroundColor: theme.colors.backgroundDark,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
  seeAllText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.medium,
  },
  fuelPricesContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
  },
  fuelPriceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fuelType: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
  },
  fuelPrice: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textLight,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  reviewCount: {
    color: theme.colors.accent,
  },
  groceryItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
    width: 150,
    alignItems: 'center',
  },
  groceryImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  groceryName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  groceryPrice: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginHorizontal: theme.spacing.sm,
  },
  addButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  addButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  fuelFriendsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fuelFriendItem: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    width: '48%',
    marginBottom: theme.spacing.md,
    alignItems: 'center',
  },
  friendAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: theme.spacing.sm,
  },
  friendName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.xs,
  },
  friendAmount: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.sm,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  friendLocation: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  friendRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  friendRatingText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textLight,
    marginLeft: theme.spacing.xs,
  },
  selectButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  selectButtonText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textLight,
  },
  viewMoreButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  viewMoreText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.accent,
    fontWeight: theme.fontWeight.medium,
  },
  orderNowButton: {
    backgroundColor: theme.colors.accent,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  orderNowText: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textLight,
  },
});

export default StationDetailsScreen;
