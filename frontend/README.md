#  Fuel App Frontend - React Native

A modern React Native mobile application for fuel pre-ordering and pickup with Mapbox integration and dark theme design.

##  Features

- **Dark Theme UI**: Modern black and green design matching the provided mockups
- **Station Finder**: Interactive Mapbox maps with station search and filtering
- **Order Management**: Complete order creation, tracking, and QR code pickup
- **Payment Integration**: Stripe payment processing
- **Real-time Tracking**: Order tracking with map visualization
- **User Profile**: Profile management with loyalty points
- **Multi-language Support**: Internationalization ready

##  Design System

### Color Palette
- **Primary**: Black (#1A1A1A) - Headers, buttons, key elements
- **Accent**: Green (#00FF00) - Highlights, CTAs, success states  
- **Secondary**: White (#FFFFFF) - Backgrounds, cards, secondary elements
- **Background Dark**: Dark gray (#1A1A1A) - Main background
- **Background Secondary**: Medium gray (#2C2C2C) - Cards and containers

### Typography
- **Font Sizes**: 12px (xs) to 32px (xxxl)
- **Font Weights**: Light (300) to Bold (700)
- **Accessibility**: WCAG 2.1 compliant contrast ratios

##  Technology Stack

- **React Native**: 0.72.6
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit + Redux Persist
- **Maps**: Mapbox GL with custom dark theme
- **UI Components**: React Native Elements + Vector Icons
- **QR Codes**: React Native QR Code libraries
- **Payments**: Stripe React Native SDK
- **Notifications**: Firebase Cloud Messaging

##  Screens Implemented

### Core Screens
1. **HomeScreen** - Dashboard with quick actions and recent orders
2. **StationFinderScreen** - Interactive map with station search and filtering
3. **OrderScreen** - Order history with filtering options
4. **ProfileScreen** - User profile with loyalty points and stats

### Authentication Screens
5. **LoginScreen** - User login with OAuth options
6. **RegisterScreen** - User registration

### Order Flow Screens
7. **StationDetailsScreen** - Station information with fuel prices and services
8. **ReviewsScreen** - Station reviews and ratings
9. **CreateOrderScreen** - Order creation with fuel selection and add-ons
10. **OrderSummaryScreen** - Order summary with progress steps
11. **PaymentScreen** - Payment method selection and processing
12. **QRCodeScreen** - QR code display for pickup
13. **TrackOrderScreen** - Real-time order tracking with map
14. **OrderDetailsScreen** - Detailed order information

### Settings Screens
15. **SettingsScreen** - App preferences and configuration
16. **VehicleManagementScreen** - Vehicle management

##  Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- iOS Simulator / Android Studio
- Mapbox Access Token

### Installation

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Environment Setup**
```bash
# Copy environment file
cp .env.example .env

# Update with your API keys
MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
API_BASE_URL=http://localhost:3000/api
```

3. **iOS Setup**
```bash
cd ios
pod install
cd ..
```

4. **Run on Device**
```bash
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

##  UI Components

### Core Components
- **LoadingSpinner** - Loading indicator with customizable text
- **StationCard** - Station information card with ratings and prices
- **OrderCard** - Order information card with status
- **QuickActionButton** - Quick action buttons for home screen
- **FilterModal** - Station filtering modal with multiple options

### Styling
- **Theme System** - Centralized theme with colors, spacing, typography
- **Dark Mode** - Complete dark theme implementation
- **Responsive Design** - Adaptive layouts for different screen sizes
- **Accessibility** - WCAG 2.1 compliant design

##  Mapbox Integration

### Custom Dark Theme
- Dark background with green accent pins
- Custom map style for fuel stations
- Real-time location tracking
- Station markers with custom icons

### Features
- Station search and filtering
- Distance calculation and sorting
- Interactive station selection
- Route visualization for order tracking

##  Payment Integration

### Stripe Integration
- Multiple payment methods (Card, Apple Pay, Google Pay)
- Secure payment processing
- Payment confirmation and receipts
- Error handling and validation

##  Notifications

### Push Notifications
- Order status updates
- Payment confirmations
- Promotional offers
- Real-time alerts

##  Internationalization

### Multi-language Support
- English (en)
- Spanish (es) 
- French (fr)
- Arabic (ar)
- Chinese (zh)

### Features
- RTL support for Arabic
- Currency localization
- Date/time formatting
- Number formatting

##  Platform Features

### iOS Features
- Native iOS UI components
- Apple Pay integration
- Push notifications
- Background location updates

### Android Features
- Material Design components
- Google Pay integration
- Firebase messaging
- Location permissions

##  Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- StationCard.test.js
```

##  Development

### Code Structure
```
src/
 components/          # Reusable UI components
 screens/            # App screens
 navigation/         # Navigation configuration
 services/           # API and external services
 store/              # Redux store and slices
 styles/             # Theme and styling
 utils/              # Helper functions
```

### State Management
- **Redux Toolkit** - Modern Redux with less boilerplate
- **Redux Persist** - State persistence across app restarts
- **Async Thunks** - API calls and async operations

### Navigation
- **Stack Navigator** - Screen transitions
- **Tab Navigator** - Bottom tab navigation
- **Drawer Navigator** - Side menu navigation

##  Deployment

### iOS Deployment
```bash
# Build for production
npx react-native run-ios --configuration Release

# Archive for App Store
cd ios
xcodebuild -workspace FuelApp.xcworkspace -scheme FuelApp -configuration Release -destination generic/platform=iOS -archivePath FuelApp.xcarchive archive
```

### Android Deployment
```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB for Play Store
./gradlew bundleRelease
```

##  API Integration

### Backend Communication
- RESTful API calls
- JWT authentication
- Error handling and retry logic
- Offline support with caching

### Endpoints Used
- Authentication (login, register, profile)
- Stations (search, details, ratings)
- Orders (create, track, history)
- Payments (process, confirm)
- Notifications (send, receive)

##  Security

### Data Protection
- JWT token storage
- Secure API communication
- Input validation and sanitization
- Biometric authentication support

##  Performance

### Optimizations
- Image optimization and lazy loading
- List virtualization for large datasets
- Memory management
- Bundle size optimization

### Monitoring
- Performance metrics
- Error tracking
- User analytics
- Crash reporting

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

##  License

MIT License - see LICENSE file for details.

##  Support

- **Documentation**: https://docs.fuelapp.com
- **Issues**: GitHub Issues
- **Email**: support@fuelapp.com

---

**Built with  by the Fuel App Team**

*This React Native frontend provides a complete mobile experience for fuel pre-ordering with modern UI design, real-time features, and seamless integration with the backend API.*
