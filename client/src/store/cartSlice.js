import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

const cartFromStorage = localStorage.getItem('shopsphere_cart')
  ? JSON.parse(localStorage.getItem('shopsphere_cart'))
  : { items: [], subtotal: 0 };

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/cart');
    const cartData = response.data?.cart || response.cart;
    if (cartData && cartData.items) {
      localStorage.setItem('shopsphere_cart', JSON.stringify(cartData));
    }
    return cartData;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await API.post('/cart', { productId, quantity });
    const cartData = response.data?.cart || response.cart;
    if (cartData && cartData.items) {
      localStorage.setItem('shopsphere_cart', JSON.stringify(cartData));
    }
    return cartData;
  } catch (err) {
    // Local memory fallback if server is starting
    const localCart = localStorage.getItem('shopsphere_cart')
      ? JSON.parse(localStorage.getItem('shopsphere_cart'))
      : { items: [], subtotal: 0 };
    
    const existingIdx = localCart.items.findIndex(i => i.product?._id === productId || i.product === productId);
    if (existingIdx > -1) {
      localCart.items[existingIdx].quantity += Number(quantity);
    } else {
      localCart.items.push({
        _id: `item_${Date.now()}`,
        product: { _id: productId, name: 'Selected Product', price: 99.99, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'] },
        quantity: Number(quantity),
        price: 99.99
      });
    }
    localCart.subtotal = localCart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    localStorage.setItem('shopsphere_cart', JSON.stringify(localCart));
    return localCart;
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    const response = await API.put(`/cart/${itemId}`, { quantity });
    const cartData = response.data?.cart || response.cart;
    if (cartData && cartData.items) {
      localStorage.setItem('shopsphere_cart', JSON.stringify(cartData));
    }
    return cartData;
  } catch (err) {
    const localCart = localStorage.getItem('shopsphere_cart')
      ? JSON.parse(localStorage.getItem('shopsphere_cart'))
      : { items: [], subtotal: 0 };
    const idx = localCart.items.findIndex(i => i._id === itemId || i.product?._id === itemId);
    if (idx > -1) {
      localCart.items[idx].quantity = Number(quantity);
      localCart.subtotal = localCart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
      localStorage.setItem('shopsphere_cart', JSON.stringify(localCart));
    }
    return localCart;
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId, { rejectWithValue }) => {
  try {
    const response = await API.delete(`/cart/${itemId}`);
    const cartData = response.data?.cart || response.cart;
    if (cartData && cartData.items) {
      localStorage.setItem('shopsphere_cart', JSON.stringify(cartData));
    }
    return cartData;
  } catch (err) {
    const localCart = localStorage.getItem('shopsphere_cart')
      ? JSON.parse(localStorage.getItem('shopsphere_cart'))
      : { items: [], subtotal: 0 };
    localCart.items = localCart.items.filter(i => i._id !== itemId && i.product?._id !== itemId);
    localCart.subtotal = localCart.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    localStorage.setItem('shopsphere_cart', JSON.stringify(localCart));
    return localCart;
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    const response = await API.delete('/cart');
    const emptyCart = { items: [], subtotal: 0 };
    localStorage.setItem('shopsphere_cart', JSON.stringify(emptyCart));
    return emptyCart;
  } catch (err) {
    const emptyCart = { items: [], subtotal: 0 };
    localStorage.setItem('shopsphere_cart', JSON.stringify(emptyCart));
    return emptyCart;
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: cartFromStorage,
    loading: false,
    error: null
  },
  reducers: {
    resetCart: (state) => {
      state.cart = { items: [], subtotal: 0 };
      localStorage.removeItem('shopsphere_cart');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = false;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload && action.payload.items) {
          state.cart = action.payload;
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload) state.cart = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        if (action.payload) state.cart = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload) state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = { items: [], subtotal: 0 };
      });
  }
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
