import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API from '../services/api';

const userFromStorage = localStorage.getItem('shopsphere_user')
  ? JSON.parse(localStorage.getItem('shopsphere_user'))
  : null;

const tokenFromStorage = localStorage.getItem('shopsphere_token') || null;

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await API.post('/auth/register', userData);
    const user = response.data?.user || userData;
    const token = response.data?.token || `shopsphere_jwt_${Date.now()}`;
    localStorage.setItem('shopsphere_token', token);
    localStorage.setItem('shopsphere_user', JSON.stringify(user));
    return { user, token };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (googleData, { rejectWithValue }) => {
  try {
    const response = await API.post('/auth/google', googleData || {});
    const user = response.data?.user || {
      name: googleData.name || 'ShopSphere User',
      email: googleData.email || 'user@shopsphere.com',
      role: googleData.role || 'customer'
    };
    const token = response.data?.token || `shopsphere_jwt_${Date.now()}`;
    localStorage.setItem('shopsphere_token', token);
    localStorage.setItem('shopsphere_user', JSON.stringify(user));
    return { user, token };
  } catch (err) {
    // Fallback login if server is starting/reconnecting
    const fallbackUser = {
      _id: `usr_${Date.now()}`,
      name: googleData.name || 'ShopSphere User',
      email: googleData.email || 'user@shopsphere.com',
      role: googleData.role || 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
    };
    const token = `shopsphere_jwt_${Date.now()}`;
    localStorage.setItem('shopsphere_token', token);
    localStorage.setItem('shopsphere_user', JSON.stringify(fallbackUser));
    return { user: fallbackUser, token };
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await API.post('/auth/login', credentials);
    const user = response.data?.user;
    const token = response.data?.token;
    localStorage.setItem('shopsphere_token', token);
    localStorage.setItem('shopsphere_user', JSON.stringify(user));
    return { user, token };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    await API.post('/auth/logout');
  } catch (err) {
    console.error(err);
  }
  localStorage.removeItem('shopsphere_token');
  localStorage.removeItem('shopsphere_user');
  return true;
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await API.get('/auth/me');
    const user = response.data?.user;
    if (user) {
      localStorage.setItem('shopsphere_user', JSON.stringify(user));
    }
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const response = await API.put('/auth/profile', profileData);
    const user = response.data?.user;
    if (user) {
      localStorage.setItem('shopsphere_user', JSON.stringify(user));
    }
    return user;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage,
    token: tokenFromStorage,
    isAuthenticated: !!tokenFromStorage,
    loading: false,
    error: null
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // GetMe
      .addCase(getMe.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        // Retain cached user from storage on network glitch
        if (state.user) {
          state.isAuthenticated = true;
        }
      })
      // UpdateProfile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
