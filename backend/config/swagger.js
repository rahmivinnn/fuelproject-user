const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fuel Pre-Order API',
      version: '1.0.0',
      description: 'API for fuel pre-order and pickup mobile application',
      contact: {
        name: 'Fuel App Team',
        email: 'support@fuelapp.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3000/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            loyaltyPoints: { type: 'number' },
            loyaltyTier: { type: 'string', enum: ['bronze', 'silver', 'gold', 'platinum'] },
            preferences: {
              type: 'object',
              properties: {
                language: { type: 'string', enum: ['en', 'es', 'fr', 'ar', 'zh'] },
                currency: { type: 'string' },
                units: { type: 'string', enum: ['metric', 'imperial'] },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean' },
                    push: { type: 'boolean' },
                    sms: { type: 'boolean' }
                  }
                }
              }
            }
          }
        },
        Station: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            brand: { type: 'string' },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                country: { type: 'string' },
                postalCode: { type: 'string' },
                coordinates: {
                  type: 'object',
                  properties: {
                    latitude: { type: 'number' },
                    longitude: { type: 'number' }
                  }
                }
              }
            },
            fuelTypes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string' },
                  price: { type: 'number' },
                  currency: { type: 'string' },
                  isAvailable: { type: 'boolean' }
                }
              }
            },
            rating: {
              type: 'object',
              properties: {
                average: { type: 'number' },
                count: { type: 'number' }
              }
            },
            isOpen: { type: 'boolean' },
            distance: { type: 'number' }
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            orderNumber: { type: 'string' },
            user: { type: 'string' },
            station: { type: 'string' },
            fuelType: { type: 'string' },
            quantity: { type: 'number' },
            unit: { type: 'string' },
            pricing: {
              type: 'object',
              properties: {
                basePrice: { type: 'number' },
                fuelPrice: { type: 'number' },
                tax: { type: 'number' },
                serviceFee: { type: 'number' },
                totalAmount: { type: 'number' },
                currency: { type: 'string' }
              }
            },
            pickup: {
              type: 'object',
              properties: {
                scheduledTime: { type: 'string', format: 'date-time' },
                actualTime: { type: 'string', format: 'date-time' },
                status: { type: 'string' },
                qrCode: { type: 'string' }
              }
            },
            status: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJSDoc(options);

module.exports = specs;
