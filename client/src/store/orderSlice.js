import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { rejectWithValue }) => {
  try {
    const response = await API.post('/orders', orderData);
    return response.data.order;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/orders');
    return response.data.orders;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchOrderById', async (id, { rejectWithValue }) => {
  try {
    const response = await API.get(`/orders/${id}`);
    return response.data.order;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchDashboardStats = createAsyncThunk('orders/fetchDashboardStats', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/orders/admin/dashboard-stats');
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    dashboardStats: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
