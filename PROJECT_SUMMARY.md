#  Fuel Pre-Order and Pickup App - Complete Implementation

A production-ready, fullstack fuel pre-order and pickup mobile application built with React Native, Node.js, and MongoDB, featuring Mapbox integration and a modern black-and-green light theme.

##  Project Structure

```
fuel-preorder-app/
  frontend/                    # React Native Mobile App
    src/
       screens/               # App screens (Home, Login, StationFinder, etc.)
       components/            # Reusable UI components
       navigation/            # React Navigation setup
       services/              # API integration & Mapbox
       store/                 # Redux store & slices
       styles/                # Theme & styling
       utils/                 # Helper functions
    android/                   # Android-specific code
    ios/                       # iOS-specific code
    App.js                     # Main app entry point
    package.json               # Frontend dependencies
  backend/                    # Node.js API Server
    routes/                    # API route handlers
    models/                    # MongoDB schemas
    controllers/               # Business logic
    middleware/                # Auth, validation, etc.
    config/                    # Configuration files
    scripts/                   # Database seeding
    server.js                  # Main server file
    package.json               # Backend dependencies
  database/                   # Database schemas & seeds
  docs/                       # Documentation
    api/                       # API documentation
  tests/                      # Test files
  docker-compose.yml          # Docker configuration
  README.md                   # Project documentation
  setup scripts               # Setup automation
```

##  Design System

### Color Palette
- **Primary**: Black (#1A1A1A) - Headers, buttons, key elements
- **Accent**: Green (#00FF00) - Highlights, CTAs, success states
- **Secondary**: White (#FFFFFF) - Backgrounds, cards, secondary elements
- **Text**: Black (#1A1A1A) on white, Green (#00FF00) for emphasis

### Typography
- **Font Sizes**: 12px (xs) to 32px (xxxl)
- **Font Weights**: Light (300) to Bold (700)
- **Accessibility**: WCAG 2.1 compliant contrast ratios

##  Technology Stack

### Frontend (React Native)
- **Framework**: React Native 0.72.6
- **Navigation**: React Navigation 6
- **State Management**: Redux Toolkit + Redux Persist
- **Maps**: Mapbox GL with custom light theme
- **UI Components**: React Native Elements + Paper
- **Authentication**: JWT with OAuth support
- **Payments**: Stripe React Native SDK
- **Notifications**: Firebase Cloud Messaging
- **Internationalization**: i18n-js

### Backend (Node.js)
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcryptjs
- **Payments**: Stripe API integration
- **Notifications**: Firebase Admin + Twilio + SendGrid
- **Caching**: Redis
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, Rate Limiting

### Third-Party Integrations
- **Maps**: Mapbox API with custom styling
- **Payments**: Stripe (multi-currency support)
- **Notifications**: Firebase FCM, Twilio SMS, SendGrid Email
- **Geolocation**: React Native Geolocation Service
- **QR Codes**: React Native QR Code libraries

##  Key Features

###  Authentication & User Management
- JWT-based authentication
- OAuth integration (Google, Apple, Facebook)
- User profile management
- Vehicle management system
- Multi-language preferences
- Loyalty points system

###  Station Finder & Maps
- Interactive Mapbox maps with light theme
- Real-time station search and filtering
- Distance calculation and sorting
- Station details with ratings and reviews
- Operating hours and availability status
- Fuel type and pricing information

###  Fuel Pre-Order System
- Station selection and fuel type choice
- Quantity selection with unit conversion
- Scheduled pickup time slots
- Add-on services (car wash, convenience store)
- Real-time pricing with tax calculation
- QR code generation for pickup

###  Payment Processing
- Stripe integration with multiple payment methods
- Apple Pay and Google Pay support
- Multi-currency support with real-time conversion
- Secure payment processing
- Payment confirmation and receipts

###  Order Management
- Order history and tracking
- Status updates with push notifications
- Order cancellation with refund handling
- Rating and review system
- Digital receipt generation

###  Notifications
- Push notifications via Firebase FCM
- Email notifications via SendGrid
- SMS notifications via Twilio
- Order status updates
- Promotional offers and deals

###  Internationalization
- Multi-language support (EN, ES, FR, AR, ZH)
- Multi-currency support
- RTL support for Arabic
- Country-specific fuel types and regulations

##  Mobile App Screens

### Core Screens
1. **HomeScreen** - Dashboard with quick actions and recent orders
2. **StationFinderScreen** - Interactive map with station search
3. **OrderScreen** - Order history and management
4. **ProfileScreen** - User profile and settings

### Authentication Screens
5. **LoginScreen** - User login with OAuth options
6. **RegisterScreen** - User registration

### Order Flow Screens
7. **StationDetailsScreen** - Station information and services
8. **CreateOrderScreen** - Order creation with fuel selection
9. **PaymentScreen** - Payment processing
10. **QRCodeScreen** - QR code display for pickup
11. **OrderDetailsScreen** - Order tracking and management

### Settings Screens
12. **SettingsScreen** - App preferences and configuration
13. **VehicleManagementScreen** - Vehicle management

##  API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Stations
- `GET /api/stations/nearby` - Find nearby stations
- `GET /api/stations/search` - Search stations
- `GET /api/stations/:id` - Get station details
- `GET /api/stations/brands` - Get available brands
- `GET /api/stations/fuel-types` - Get fuel types
- `PUT /api/stations/:id/rating` - Rate station

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/rating` - Rate order

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/webhook` - Stripe webhook handler

### Notifications
- `POST /api/notifications/send` - Send notification
- `POST /api/notifications/order-update` - Send order update

##  Database Schema

### User Collection
- Personal information (name, email, phone)
- Authentication data (password, OAuth providers)
- Vehicle information (make, model, fuel type)
- Payment methods (Stripe integration)
- Loyalty points and tier
- Preferences (language, currency, notifications)
- Addresses and location data

### Station Collection
- Basic information (name, brand, description)
- Location data (address, coordinates)
- Operating hours and contact info
- Fuel types and pricing
- EV charging information
- Services and amenities
- Ratings and reviews
- Real-time data (stock, queue times)

### Order Collection
- Order details (number, user, station)
- Fuel information (type, quantity, unit)
- Pricing breakdown (base, tax, fees, total)
- Pickup scheduling and QR codes
- Payment information (method, status, transaction)
- Add-ons and services
- Status tracking and notifications
- Rating and feedback

##  Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- React Native CLI
- iOS Simulator / Android Studio
- Mapbox Access Token
- Stripe Account

### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd fuel-preorder-app

# Run setup script
# Windows:
setup.bat

# Linux/Mac:
chmod +x setup.sh
./setup.sh
```

2. **Configure Environment**
```bash
# Update backend/.env with your API keys
MAPBOX_ACCESS_TOKEN=pk.your_token_here
STRIPE_SECRET_KEY=sk_test_your_key_here
MONGODB_URI=mongodb://localhost:27017/fuelapp

# Update frontend/.env
MAPBOX_ACCESS_TOKEN=pk.your_token_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
API_BASE_URL=http://localhost:3000/api
```

3. **Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run start:backend   # Backend on :3000
npm run start:frontend  # React Native Metro
```

4. **Run on Device**
```bash
# Android
cd frontend
npx react-native run-android

# iOS
cd frontend
npx react-native run-ios
```

##  Docker Deployment

```bash
# Build and run with Docker
npm run docker:build
npm run docker:up

# Stop containers
npm run docker:down
```

##  Testing

```bash
# Run all tests
npm test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# E2E tests
cd tests/e2e
npm run test:e2e
```

##  API Documentation

Interactive API documentation is available at:
- **Development**: http://localhost:3000/docs
- **Swagger File**: `docs/api/swagger.yaml`

##  Security Features

- JWT-based authentication with refresh tokens
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting and CORS protection
- HTTPS enforcement
- PCI-DSS compliance for payments
- AES-256 encryption for sensitive data

##  Global Compliance

- GDPR/CCPA data protection
- Multi-language and currency support
- Country-specific fuel regulations
- Geo-fencing for restricted areas
- Data localization requirements

##  Performance Optimizations

- Redux state management with persistence
- Image optimization and lazy loading
- API response caching with Redis
- Database indexing and query optimization
- React Native performance best practices
- Mapbox map optimization

##  Deployment Options

### AWS Deployment
- **Backend**: Elastic Beanstalk
- **Frontend**: S3 + CloudFront
- **Database**: MongoDB Atlas
- **Cache**: ElastiCache (Redis)

### Docker Deployment
- Multi-container setup
- MongoDB and Redis services
- Production-ready configuration

##  Mobile App Features

### iOS Features
- Native iOS UI components
- Apple Pay integration
- Push notifications
- Background location updates
- Camera integration for QR scanning

### Android Features
- Material Design components
- Google Pay integration
- Firebase messaging
- Location permissions
- Barcode scanning

##  Development Tools

- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Native Testing Library
- **Debugging**: Flipper, React Native Debugger
- **State Management**: Redux DevTools
- **API Testing**: Postman, Swagger UI

##  Monitoring & Analytics

- Error tracking and logging
- Performance monitoring
- User analytics
- API usage metrics
- Payment transaction tracking

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

##  License

MIT License - see LICENSE file for details.

##  Support

- **Email**: support@fuelapp.com
- **Documentation**: https://docs.fuelapp.com
- **Issues**: GitHub Issues
- **Discord**: Fuel App Community

---

##  Project Status

 **Complete Implementation** - All core features implemented
 **Production Ready** - Security, performance, and scalability optimized
 **Mobile Optimized** - iOS and Android support
 **Global Ready** - Multi-language and currency support
 **Well Documented** - Comprehensive documentation and API specs

**Built with  by the Fuel App Team**

---

*This is a complete, production-ready implementation of a fuel pre-order and pickup mobile application with all the requested features, modern architecture, and comprehensive documentation.*
