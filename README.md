# Fuel Pre-Order and Pickup App

A production-ready, React Native mobile app for pre-ordering fuel for pickup at partnered stations worldwide, featuring Mapbox integration and a modern black-and-green light theme.

##  Features

- **Station Finder**: Interactive Mapbox maps with real-time station data
- **Pre-Order System**: Book fuel with QR code pickup
- **Multi-Currency Payments**: Stripe integration with global payment methods
- **Loyalty Rewards**: Points system with tiered benefits
- **EV Charging**: Electric vehicle charging station reservations
- **Multi-Language Support**: i18n with 5+ languages
- **Push Notifications**: Firebase Cloud Messaging
- **Admin Dashboard**: Web-based management interface

##  Theme

- **Primary**: Black (#1A1A1A)
- **Accent**: Green (#00FF00) 
- **Secondary**: White (#FFFFFF)
- **Text**: Black (#1A1A1A) on white backgrounds

##  Tech Stack

### Frontend
- React Native (iOS/Android)
- React Navigation
- Mapbox GL
- Redux Toolkit
- Firebase (FCM, Auth)
- Stripe SDK

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Redis (Caching)
- Docker

### Third-Party Integrations
- Mapbox API
- Stripe Payments
- Firebase Cloud Messaging
- Twilio SMS
- SendGrid Email

##  Quick Start

### Prerequisites
- Node.js 18+
- React Native CLI
- MongoDB
- iOS Simulator / Android Studio
- Mapbox Access Token

### Installation

1. **Clone and Install**
```bash
git clone <repository-url>
cd fuel-preorder-app
npm run install:all
```

2. **Environment Setup**
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update with your API keys
# MAPBOX_ACCESS_TOKEN=pk.your_token_here
# STRIPE_SECRET_KEY=sk_test_your_key_here
# MONGODB_URI=mongodb://localhost:27017/fuelapp
```

3. **Database Setup**
```bash
cd backend
npm run seed
```

4. **Start Development**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run start:backend  # Backend on :3000
npm run start:frontend # React Native Metro
```

5. **Run on Device**
```bash
# iOS
cd frontend
npx react-native run-ios

# Android
cd frontend
npx react-native run-android
```

##  Project Structure

```
fuel-preorder-app/
 frontend/                 # React Native App
    src/
       screens/         # App screens
       components/      # Reusable components
       navigation/      # React Navigation
       services/        # API & Mapbox integration
       store/          # Redux store
       styles/         # Theme & styles
    android/            # Android specific
    ios/                # iOS specific
 backend/                 # Node.js API
    routes/             # API routes
    controllers/        # Business logic
    models/             # MongoDB schemas
    middleware/         # Auth, validation
    utils/              # Helper functions
 database/               # Database scripts
    schemas/            # MongoDB schemas
    seeds/              # Sample data
 docs/                   # Documentation
    api/                # Swagger API docs
 tests/                  # Test files
     unit/               # Jest tests
     e2e/                # Appium tests
```

##  Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fuelapp
JWT_SECRET=your_jwt_secret
MAPBOX_ACCESS_TOKEN=pk.your_token_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FCM_SERVER_KEY=your_fcm_server_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key
REDIS_URL=redis://localhost:6379
```

#### Frontend (.env)
```env
API_BASE_URL=http://localhost:3000/api
MAPBOX_ACCESS_TOKEN=pk.your_token_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

##  Deployment

### Docker Deployment
```bash
# Build and run with Docker
npm run docker:build
npm run docker:up

# Stop containers
npm run docker:down
```

### AWS Deployment
```bash
# Backend to Elastic Beanstalk
cd backend
eb init
eb create production

# Frontend to S3
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name
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

API documentation is available at `/docs` when running the backend server.

Key endpoints:
- `GET /api/stations/nearby` - Find nearby fuel stations
- `POST /api/orders` - Create fuel pre-order
- `GET /api/orders/:id` - Get order details
- `POST /api/payments/process` - Process payment

##  Internationalization

Supported languages:
- English (en)
- Spanish (es)
- French (fr)
- Arabic (ar)
- Chinese (zh)

##  Security

- JWT-based authentication
- AES-256 encryption
- PCI-DSS compliance
- Rate limiting
- Input validation
- HTTPS enforcement

##  License

MIT License - see LICENSE file for details.

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

##  Support

For support, email support@fuelapp.com or join our Slack channel.

---

Built with  by the Fuel App Team
