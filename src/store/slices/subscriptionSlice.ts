import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import type { SubscriptionPlan } from '@/types';

// Let's reuse the SubscriptionPlan type for now
interface SubscriptionState {
  subscriptions: any[];
  invoices: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  invoices: [],
  loading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscription/fetchSubscriptions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/subscription');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch subscriptions');
    }
  }
);

export const fetchInvoices = createAsyncThunk(
  'subscription/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/subscription/invoices');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch invoices');
    }
  }
);

export const addSubscriptionPlan = createAsyncThunk(
  'subscription/addSubscriptionPlan',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/subscription', data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add subscription plan');
    }
  }
);

export const updateSubscriptionPlan = createAsyncThunk(
  'subscription/updateSubscriptionPlan',
  async ({ id, data }: { id: string, data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/subscription/${id}`, data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update subscription plan');
    }
  }
);

export const purchaseAddons = createAsyncThunk(
  'subscription/purchaseAddons',
  async (data: { business_id: string; addons: { branches: number; team_members: number }; amount: number; currency: string; payment_method: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/subscription/addons', data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to purchase addons');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Invoices
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default subscriptionSlice.reducer;
