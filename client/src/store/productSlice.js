import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (queryParams = {}, { rejectWithValue }) => {
  try {
    const params = new URLSearchParams(queryParams).toString();
    const response = await API.get(`/products?${params}`);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchProductBySlug = createAsyncThunk('products/fetchProductBySlug', async (slugOrId, { rejectWithValue }) => {
  try {
    const response = await API.get(`/products/${slugOrId}`);
    return response.data.product;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchCategories = createAsyncThunk('products/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/categories');
    return response.data.categories;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    categories: [],
    currentProduct: null,
    page: 1,
    pages: 1,
    total: 0,
    loading: false,
    detailLoading: false,
    error: null
  },
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  }
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
