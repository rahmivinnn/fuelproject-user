import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/api';

// Async thunks
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.create(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async ({ status, limit = 20, skip = 0 }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders(status, limit, skip);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getDetails(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get order details');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancel(orderId, reason);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

export const rateOrder = createAsyncThunk(
  'order/rateOrder',
  async ({ orderId, stationRating, serviceRating, comment }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.rate(orderId, stationRating, serviceRating, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rate order');
    }
  }
);

const initialState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    skip: 0,
    hasMore: false,
  },
  filters: {
    status: null,
  },
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.pagination = {
        total: 0,
        limit: 20,
        skip: 0,
        hasMore: false,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o._id === orderId);
      if (order) {
        order.status = status;
      }
      if (state.selectedOrder && state.selectedOrder._id === orderId) {
        state.selectedOrder.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.unshift(action.payload.order);
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get order details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload.order;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Cancel order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const order = state.orders.find(o => o._id === action.payload.order._id);
        if (order) {
          order.status = 'cancelled';
          order.cancellation = action.payload.order.cancellation;
        }
        if (state.selectedOrder && state.selectedOrder._id === action.payload.order._id) {
          state.selectedOrder.status = 'cancelled';
          state.selectedOrder.cancellation = action.payload.order.cancellation;
        }
      })
      // Rate order
      .addCase(rateOrder.fulfilled, (state, action) => {
        const order = state.orders.find(o => o._id === action.payload.order._id);
        if (order) {
          order.rating = action.payload.order.rating;
        }
        if (state.selectedOrder && state.selectedOrder._id === action.payload.order._id) {
          state.selectedOrder.rating = action.payload.order.rating;
        }
      });
  },
});

export const {
  clearOrders,
  clearError,
  setSelectedOrder,
  setFilters,
  updateOrderStatus,
} = orderSlice.actions;

export default orderSlice.reducer;
