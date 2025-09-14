import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppSelector } from '../store/hooks';
import { theme } from '../styles/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import StationFinderScreen from '../screens/StationFinderScreen';
import OrderScreen from '../screens/OrderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import StationDetailsScreen from '../screens/StationDetailsScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import TrackOrderScreen from '../screens/TrackOrderScreen';
import CreateOrderScreen from '../screens/CreateOrderScreen';
import PaymentScreen from '../screens/PaymentScreen';
import QRCodeScreen from '../screens/QRCodeScreen';

// Additional Screens
import { 
  RegisterScreen, 
  OrderDetailsScreen, 
  SettingsScreen, 
  VehicleManagementScreen 
} from '../screens/AdditionalScreens';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Auth Stack
const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: theme.colors.backgroundDark },
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Stations':
            iconName = 'location-on';
            break;
          case 'Orders':
            iconName = 'receipt';
            break;
          case 'Profile':
            iconName = 'person';
            break;
          default:
            iconName = 'circle';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: theme.colors.accent,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderTopColor: theme.colors.border,
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      headerStyle: {
        backgroundColor: theme.colors.backgroundDark,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: theme.colors.textLight,
      headerTitleStyle: {
        fontWeight: theme.fontWeight.semibold,
      },
    })}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{ title: 'Fuel App' }}
    />
    <Tab.Screen 
      name="Stations" 
      component={StationFinderScreen}
      options={{ title: 'Find Stations' }}
    />
    <Tab.Screen 
      name="Orders" 
      component={OrderScreen}
      options={{ title: 'My Orders' }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

// Main Stack Navigator
const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.backgroundDark,
        elevation: 0,
        shadowOpacity: 0,
      },
      headerTintColor: theme.colors.textLight,
      headerTitleStyle: {
        fontWeight: theme.fontWeight.semibold,
      },
      cardStyle: { backgroundColor: theme.colors.backgroundDark },
    }}
  >
    <Stack.Screen 
      name="MainTabs" 
      component={MainTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen 
      name="StationDetails" 
      component={StationDetailsScreen}
      options={{ title: 'Station Details' }}
    />
    <Stack.Screen 
      name="Reviews" 
      component={ReviewsScreen}
      options={{ title: 'Reviews' }}
    />
    <Stack.Screen 
      name="CreateOrder" 
      component={CreateOrderScreen}
      options={{ title: 'Create Order' }}
    />
    <Stack.Screen 
      name="OrderSummary" 
      component={OrderSummaryScreen}
      options={{ title: 'Order Summary' }}
    />
    <Stack.Screen 
      name="TrackOrder" 
      component={TrackOrderScreen}
      options={{ title: 'Track Your Order' }}
    />
    <Stack.Screen 
      name="OrderDetails" 
      component={OrderDetailsScreen}
      options={{ title: 'Order Details' }}
    />
    <Stack.Screen 
      name="Payment" 
      component={PaymentScreen}
      options={{ title: 'Payment' }}
    />
    <Stack.Screen 
      name="QRCode" 
      component={QRCodeScreen}
      options={{ title: 'QR Code' }}
    />
    <Stack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Settings' }}
    />
    <Stack.Screen 
      name="VehicleManagement" 
      component={VehicleManagementScreen}
      options={{ title: 'Manage Vehicles' }}
    />
  </Stack.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="MainStack" component={MainStack} />
      ) : (
        <Stack.Screen name="AuthStack" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
