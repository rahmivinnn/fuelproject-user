import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../../services/api';

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const addVehicle = createAsyncThunk(
  'user/addVehicle',
  async (vehicleData, { rejectWithValue }) => {
    try {
      const response = await userAPI.addVehicle(vehicleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add vehicle');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'user/updateVehicle',
  async ({ vehicleId, vehicleData }, { rejectWithValue }) => {
    try {
      const response = await userAPI.updateVehicle(vehicleId, vehicleData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vehicle');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'user/deleteVehicle',
  async (vehicleId, { rejectWithValue }) => {
    try {
      const response = await userAPI.deleteVehicle(vehicleId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete vehicle');
    }
  }
);

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await userAPI.updatePreferences(preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update preferences');
    }
  }
);

const initialState = {
  profile: null,
  vehicles: [],
  preferences: {
    language: 'en',
    currency: 'USD',
    units: 'metric',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
      if (action.payload.vehicles) {
        state.vehicles = action.payload.vehicles;
      }
      if (action.payload.preferences) {
        state.preferences = { ...state.preferences, ...action.payload.preferences };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    updateVehicleInList: (state, action) => {
      const { vehicleId, updates } = action.payload;
      const vehicleIndex = state.vehicles.findIndex(v => v._id === vehicleId);
      if (vehicleIndex !== -1) {
        state.vehicles[vehicleIndex] = { ...state.vehicles[vehicleIndex], ...updates };
      }
    },
    removeVehicleFromList: (state, action) => {
      state.vehicles = state.vehicles.filter(v => v._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add vehicle
      .addCase(addVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.user.vehicles;
        state.error = null;
      })
      .addCase(addVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update vehicle
      .addCase(updateVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.user.vehicles;
        state.error = null;
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete vehicle
      .addCase(deleteVehicle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.vehicles = action.payload.user.vehicles;
        state.error = null;
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = { ...state.preferences, ...action.payload.user.preferences };
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setProfile,
  clearError,
  updateVehicleInList,
  removeVehicleFromList,
} = userSlice.actions;

export default userSlice.reducer;
