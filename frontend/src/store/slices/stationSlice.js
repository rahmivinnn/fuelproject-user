import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stationAPI } from '../../services/api';

// Async thunks
export const fetchNearbyStations = createAsyncThunk(
  'station/fetchNearbyStations',
  async ({ latitude, longitude, radius = 10, fuelType, brand }, { rejectWithValue }) => {
    try {
      const response = await stationAPI.getNearby(latitude, longitude, radius, fuelType, brand);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stations');
    }
  }
);

export const searchStations = createAsyncThunk(
  'station/searchStations',
  async ({ query, latitude, longitude }, { rejectWithValue }) => {
    try {
      const response = await stationAPI.search(query, latitude, longitude);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getStationDetails = createAsyncThunk(
  'station/getStationDetails',
  async (stationId, { rejectWithValue }) => {
    try {
      const response = await stationAPI.getDetails(stationId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get station details');
    }
  }
);

export const getStationBrands = createAsyncThunk(
  'station/getStationBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stationAPI.getBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get brands');
    }
  }
);

export const getFuelTypes = createAsyncThunk(
  'station/getFuelTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await stationAPI.getFuelTypes();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get fuel types');
    }
  }
);

export const rateStation = createAsyncThunk(
  'station/rateStation',
  async ({ stationId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await stationAPI.rateStation(stationId, rating, comment);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to rate station');
    }
  }
);

const initialState = {
  stations: [],
  selectedStation: null,
  brands: [],
  fuelTypes: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  filters: {
    fuelType: null,
    brand: null,
    radius: 10,
  },
  location: {
    latitude: null,
    longitude: null,
  },
};

const stationSlice = createSlice({
  name: 'station',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearStations: (state) => {
      state.stations = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    setSelectedStation: (state, action) => {
      state.selectedStation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch nearby stations
      .addCase(fetchNearbyStations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyStations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stations = action.payload.stations;
        state.error = null;
      })
      .addCase(fetchNearbyStations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Search stations
      .addCase(searchStations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchStations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stations = action.payload.stations;
        state.searchQuery = action.payload.searchQuery;
        state.error = null;
      })
      .addCase(searchStations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get station details
      .addCase(getStationDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStationDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedStation = action.payload.station;
      })
      .addCase(getStationDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get brands
      .addCase(getStationBrands.fulfilled, (state, action) => {
        state.brands = action.payload.brands;
      })
      // Get fuel types
      .addCase(getFuelTypes.fulfilled, (state, action) => {
        state.fuelTypes = action.payload.fuelTypes;
      })
      // Rate station
      .addCase(rateStation.fulfilled, (state, action) => {
        const station = state.stations.find(s => s._id === action.payload.stationId);
        if (station) {
          station.rating = action.payload.rating;
        }
        if (state.selectedStation && state.selectedStation._id === action.payload.stationId) {
          state.selectedStation.rating = action.payload.rating;
        }
      });
  },
});

export const {
  setLocation,
  setFilters,
  clearStations,
  clearError,
  setSelectedStation,
} = stationSlice.actions;

export default stationSlice.reducer;
