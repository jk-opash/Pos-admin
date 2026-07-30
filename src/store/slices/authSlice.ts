import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { initializeSocket, disconnectSocket } from '../../lib/socket';

interface AuthState {
  token: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const authData = localStorage.getItem('admin_auth');
    if (authData) {
      try {
        const { token, email, role, general_data, invoice_data } = JSON.parse(authData);
        if (token) {
          // Initialize socket if token exists on load
          initializeSocket(token);
          return {
            token,
            user: { email, role, general_data, invoice_data },
            isAuthenticated: true,
            loading: false,
            error: null,
          };
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login/superadmin', credentials);
      return response.data; // Expected to return { token }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || error.message || 'Login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_auth');
      }
      disconnectSocket();
    },
    updateUserSettings: (state, action: PayloadAction<{ general_data?: any; invoice_data?: any }>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        if (typeof window !== 'undefined') {
          const authData = localStorage.getItem('admin_auth');
          if (authData) {
            const parsed = JSON.parse(authData);
            localStorage.setItem('admin_auth', JSON.stringify({
              ...parsed,
              ...action.payload
            }));
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: any }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        
        // Capture the real user details from the backend
        state.user = action.payload.user; 

        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_auth', JSON.stringify({ 
            token: action.payload.token,
            email: action.payload.user?.email,
            role: action.payload.user?.role || 'superadmin',
            general_data: action.payload.user?.general_data,
            invoice_data: action.payload.user?.invoice_data
          }));
        }
        
        // Initialize socket with new token
        initializeSocket(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, updateUserSettings } = authSlice.actions;
export default authSlice.reducer;
