import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh', { refreshToken });
          const { token } = response.data.data;
          await AsyncStorage.setItem('token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        // You might want to dispatch a logout action here
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (email, password, firstName, lastName, phone) => 
    api.post('/auth/register', { email, password, firstName, lastName, phone }),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
};

// Station API
export const stationAPI = {
  getNearby: (latitude, longitude, radius, fuelType, brand) => 
    api.get('/stations/nearby', {
      params: { lat: latitude, lng: longitude, radius, fuelType, brand }
    }),
  search: (query, latitude, longitude) => 
    api.get('/stations/search', {
      params: { q: query, lat: latitude, lng: longitude }
    }),
  getDetails: (stationId) => api.get(`/stations/${stationId}`),
  getBrands: () => api.get('/stations/brands'),
  getFuelTypes: () => api.get('/stations/fuel-types'),
  rateStation: (stationId, rating, comment) => 
    api.put(`/stations/${stationId}/rating`, { rating, comment }),
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getUserOrders: (status, limit, skip) => 
    api.get('/orders', { params: { status, limit, skip } }),
  getDetails: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId, reason) => api.put(`/orders/${orderId}/cancel`, { reason }),
  rate: (orderId, stationRating, serviceRating, comment) => 
    api.put(`/orders/${orderId}/rating`, { stationRating, serviceRating, comment }),
};

// User API
export const userAPI = {
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  addVehicle: (vehicleData) => api.post('/users/vehicles', vehicleData),
  updateVehicle: (vehicleId, vehicleData) => 
    api.put(`/users/vehicles/${vehicleId}`, vehicleData),
  deleteVehicle: (vehicleId) => api.delete(`/users/vehicles/${vehicleId}`),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (orderId, paymentMethodId) => 
    api.post('/payments/create-payment-intent', { orderId, paymentMethodId }),
  confirmPayment: (paymentIntentId) => 
    api.post('/payments/confirm', { paymentIntentId }),
};

// Notification API
export const notificationAPI = {
  send: (type, title, body, data) => 
    api.post('/notifications/send', { type, title, body, data }),
  sendOrderUpdate: (orderId, status, message) => 
    api.post('/notifications/order-update', { orderId, status, message }),
};

export default api;
