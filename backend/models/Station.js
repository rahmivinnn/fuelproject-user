const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  
  // Location
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }
  },
  
  // Contact information
  contact: {
    phone: String,
    email: String,
    website: String
  },
  
  // Operating hours
  operatingHours: {
    monday: { open: String, close: String, is24Hours: { type: Boolean, default: false } },
    tuesday: { open: String, close: String, is24Hours: { type: Boolean, default: false } },
    wednesday: { open: String, close: String, is24Hours: { type: Boolean, default: false } },
    thursday: { open: String, close: String, is24Hours: { type: Boolean, default: false } },
    friday: { open: String, close: String, is24Hours: { type: Boolean, default: false } },
    saturday: { open: String, close: String, is24Hours: { type: Boolean, default: false } },
    sunday: { open: String, close: String, is24Hours: { type: Boolean, default: false } }
  },
  
  // Fuel types and pricing
  fuelTypes: [{
    type: {
      type: String,
      enum: ['gasoline', 'diesel', 'electric', 'lpg', 'cng', 'premium_gasoline', 'premium_diesel']
    },
    price: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }],
  
  // EV Charging (if applicable)
  evCharging: {
    isAvailable: { type: Boolean, default: false },
    connectors: [{
      type: {
        type: String,
        enum: ['Type1', 'Type2', 'CCS', 'CHAdeMO', 'Tesla']
      },
      power: Number, // kW
      price: Number,
      currency: String,
      isAvailable: { type: Boolean, default: true }
    }],
    totalConnectors: Number,
    availableConnectors: Number
  },
  
  // Services and amenities
  services: [{
    type: {
      type: String,
      enum: ['car_wash', 'convenience_store', 'restaurant', 'atm', 'air_pump', 'tire_service', 'oil_change']
    },
    name: String,
    isAvailable: { type: Boolean, default: true },
    price: Number,
    currency: String
  }],
  
  // Ratings and reviews
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  
  // Images
  images: [{
    url: String,
    caption: String,
    isPrimary: { type: Boolean, default: false }
  }],
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPartner: {
    type: Boolean,
    default: false
  },
  
  // Queue information
  queueInfo: {
    averageWaitTime: Number, // minutes
    currentQueueLength: Number,
    lastUpdated: Date
  },
  
  // Real-time data
  realTimeData: {
    fuelStock: {
      gasoline: { type: Number, min: 0, max: 100 }, // percentage
      diesel: { type: Number, min: 0, max: 100 },
      electric: { type: Number, min: 0, max: 100 }
    },
    lastUpdated: Date
  },
  
  // Admin information
  admin: {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
}, {
  timestamps: true
});

// Indexes
stationSchema.index({ 'address.coordinates': '2dsphere' });
stationSchema.index({ brand: 1 });
stationSchema.index({ 'address.city': 1, 'address.country': 1 });
stationSchema.index({ isActive: 1, isPartner: 1 });

// Instance methods
stationSchema.methods.isOpen = function() {
  const now = new Date();
  const day = now.toLocaleLowerCase().substring(0, 3) + 'day';
  const currentTime = now.toTimeString().substring(0, 5);
  
  const todayHours = this.operatingHours[day];
  if (!todayHours || todayHours.is24Hours) {
    return todayHours ? true : false;
  }
  
  return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

stationSchema.methods.getDistance = function(latitude, longitude) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (latitude - this.address.coordinates.latitude) * Math.PI / 180;
  const dLon = (longitude - this.address.coordinates.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.address.coordinates.latitude * Math.PI / 180) * Math.cos(latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

stationSchema.methods.getFuelPrice = function(fuelType, currency = 'USD') {
  const fuel = this.fuelTypes.find(f => f.type === fuelType && f.currency === currency);
  return fuel ? fuel.price : null;
};

stationSchema.methods.updateFuelPrice = function(fuelType, newPrice, currency = 'USD') {
  const fuelIndex = this.fuelTypes.findIndex(f => f.type === fuelType && f.currency === currency);
  if (fuelIndex !== -1) {
    this.fuelTypes[fuelIndex].price = newPrice;
    this.fuelTypes[fuelIndex].lastUpdated = new Date();
  }
  return this.save();
};

// Static methods
stationSchema.statics.findNearby = function(latitude, longitude, maxDistance = 10, fuelType = null) {
  const query = {
    'address.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    isActive: true
  };
  
  if (fuelType) {
    query['fuelTypes.type'] = fuelType;
    query['fuelTypes.isAvailable'] = true;
  }
  
  return this.find(query);
};

stationSchema.statics.findByBrand = function(brand) {
  return this.find({ brand: new RegExp(brand, 'i'), isActive: true });
};

stationSchema.statics.getFuelTypes = function() {
  return this.distinct('fuelTypes.type', { isActive: true });
};

module.exports = mongoose.model('Station', stationSchema);
