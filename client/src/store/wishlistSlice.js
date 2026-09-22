import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetchWishlist', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/wishlist');
    return response.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggleWishlist', async (productId, { rejectWithValue }) => {
  try {
    const response = await API.post('/wishlist', { productId });
    return response.data.wishlist;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlist: { products: [] },
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload || { products: [] };
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload || { products: [] };
      });
  }
});

export default wishlistSlice.reducer;
