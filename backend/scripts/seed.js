const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Station = require('../models/Station');
const Order = require('../models/Order');

// Sample data
const sampleUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    vehicles: [{
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      fuelType: 'gasoline',
      licensePlate: 'ABC123',
      isDefault: true
    }],
    preferences: {
      language: 'en',
      currency: 'USD',
      units: 'metric',
      notifications: {
        email: true,
        push: true,
        sms: false
      }
    },
    addresses: [{
      type: 'home',
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10001',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      },
      isDefault: true
    }]
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1987654321',
    vehicles: [{
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      fuelType: 'gasoline',
      licensePlate: 'XYZ789',
      isDefault: true
    }],
    preferences: {
      language: 'en',
      currency: 'USD',
      units: 'metric',
      notifications: {
        email: true,
        push: true,
        sms: true
      }
    }
  }
];

const sampleStations = [
  {
    name: 'Shell Downtown',
    brand: 'Shell',
    description: 'Full-service fuel station with convenience store',
    address: {
      street: '456 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10013',
      coordinates: {
        latitude: 40.7589,
        longitude: -73.9851
      }
    },
    contact: {
      phone: '+12125551234',
      email: 'downtown@shell.com'
    },
    operatingHours: {
      monday: { open: '06:00', close: '22:00', is24Hours: false },
      tuesday: { open: '06:00', close: '22:00', is24Hours: false },
      wednesday: { open: '06:00', close: '22:00', is24Hours: false },
      thursday: { open: '06:00', close: '22:00', is24Hours: false },
      friday: { open: '06:00', close: '22:00', is24Hours: false },
      saturday: { open: '07:00', close: '21:00', is24Hours: false },
      sunday: { open: '08:00', close: '20:00', is24Hours: false }
    },
    fuelTypes: [
      { type: 'gasoline', price: 3.45, currency: 'USD', isAvailable: true },
      { type: 'diesel', price: 3.65, currency: 'USD', isAvailable: true },
      { type: 'premium_gasoline', price: 3.85, currency: 'USD', isAvailable: true }
    ],
    services: [
      { type: 'convenience_store', name: 'Shell Select', isAvailable: true },
      { type: 'car_wash', name: 'Touchless Car Wash', isAvailable: true, price: 8.99, currency: 'USD' },
      { type: 'air_pump', name: 'Free Air', isAvailable: true }
    ],
    rating: { average: 4.2, count: 156 },
    isActive: true,
    isPartner: true
  },
  {
    name: 'BP Midtown',
    brand: 'BP',
    description: 'BP fuel station with EV charging',
    address: {
      street: '789 5th Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10022',
      coordinates: {
        latitude: 40.7505,
        longitude: -73.9934
      }
    },
    contact: {
      phone: '+12125552345',
      email: 'midtown@bp.com'
    },
    operatingHours: {
      monday: { open: '00:00', close: '23:59', is24Hours: true },
      tuesday: { open: '00:00', close: '23:59', is24Hours: true },
      wednesday: { open: '00:00', close: '23:59', is24Hours: true },
      thursday: { open: '00:00', close: '23:59', is24Hours: true },
      friday: { open: '00:00', close: '23:59', is24Hours: true },
      saturday: { open: '00:00', close: '23:59', is24Hours: true },
      sunday: { open: '00:00', close: '23:59', is24Hours: true }
    },
    fuelTypes: [
      { type: 'gasoline', price: 3.42, currency: 'USD', isAvailable: true },
      { type: 'diesel', price: 3.62, currency: 'USD', isAvailable: true },
      { type: 'premium_gasoline', price: 3.82, currency: 'USD', isAvailable: true }
    ],
    evCharging: {
      isAvailable: true,
      connectors: [
        { type: 'Type2', power: 22, price: 0.35, currency: 'USD', isAvailable: true },
        { type: 'CCS', power: 50, price: 0.45, currency: 'USD', isAvailable: true }
      ],
      totalConnectors: 4,
      availableConnectors: 3
    },
    services: [
      { type: 'convenience_store', name: 'BP Shop', isAvailable: true },
      { type: 'restaurant', name: 'Subway', isAvailable: true }
    ],
    rating: { average: 4.0, count: 89 },
    isActive: true,
    isPartner: true
  },
  {
    name: 'Exxon Uptown',
    brand: 'Exxon',
    description: 'Exxon fuel station with full services',
    address: {
      street: '321 Park Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10010',
      coordinates: {
        latitude: 40.7505,
        longitude: -73.9934
      }
    },
    contact: {
      phone: '+12125553456',
      email: 'uptown@exxon.com'
    },
    operatingHours: {
      monday: { open: '05:30', close: '23:30', is24Hours: false },
      tuesday: { open: '05:30', close: '23:30', is24Hours: false },
      wednesday: { open: '05:30', close: '23:30', is24Hours: false },
      thursday: { open: '05:30', close: '23:30', is24Hours: false },
      friday: { open: '05:30', close: '23:30', is24Hours: false },
      saturday: { open: '06:00', close: '23:00', is24Hours: false },
      sunday: { open: '07:00', close: '22:00', is24Hours: false }
    },
    fuelTypes: [
      { type: 'gasoline', price: 3.48, currency: 'USD', isAvailable: true },
      { type: 'diesel', price: 3.68, currency: 'USD', isAvailable: true },
      { type: 'premium_gasoline', price: 3.88, currency: 'USD', isAvailable: true }
    ],
    services: [
      { type: 'convenience_store', name: 'Exxon Tiger Mart', isAvailable: true },
      { type: 'car_wash', name: 'Express Car Wash', isAvailable: true, price: 12.99, currency: 'USD' },
      { type: 'tire_service', name: 'Tire Pressure Check', isAvailable: true, price: 2.99, currency: 'USD' }
    ],
    rating: { average: 4.5, count: 203 },
    isActive: true,
    isPartner: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fuelapp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(' Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Station.deleteMany({});
    await Order.deleteMany({});

    console.log('  Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
    }
    console.log(` Created ${users.length} users`);

    // Create stations
    const stations = [];
    for (const stationData of sampleStations) {
      const station = new Station(stationData);
      await station.save();
      stations.push(station);
    }
    console.log(` Created ${stations.length} stations`);

    // Create sample orders
    const orders = [];
    for (let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const station = stations[Math.floor(Math.random() * stations.length)];
      const fuelType = station.fuelTypes[Math.floor(Math.random() * station.fuelTypes.length)];

      const order = new Order({
        orderNumber: `FUEL-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase(),
        user: user._id,
        station: station._id,
        fuelType: fuelType.type,
        quantity: Math.random() * 50 + 10, // 10-60 liters
        unit: 'liters',
        pricing: {
          basePrice: fuelType.price * (Math.random() * 50 + 10),
          fuelPrice: fuelType.price,
          tax: 0,
          serviceFee: 0,
          totalAmount: fuelType.price * (Math.random() * 50 + 10),
          currency: fuelType.currency
        },
        pickup: {
          scheduledTime: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Next 7 days
        },
        vehicle: user.vehicles[0],
        status: ['pending', 'confirmed', 'completed'][Math.floor(Math.random() * 3)]
      });

      await order.save();
      orders.push(order);
    }
    console.log(` Created ${orders.length} orders`);

    console.log(' Database seeded successfully!');
    console.log('\n Summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Stations: ${stations.length}`);
    console.log(`- Orders: ${orders.length}`);

  } catch (error) {
    console.error(' Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log(' Database connection closed');
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
