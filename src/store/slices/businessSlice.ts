import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

export interface OnboardingFormState {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerPassword?: string;
  businessName: string;
  businessSlug: string;
  businessLegalName?: string;
  businessType: string;
  businessEmail?: string;
  businessWebsite?: string;
  address: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  gstin?: string;
  pan?: string;
  subscriptionPlanId?: string;
  billingCycle?: 'monthly' | 'yearly';
  identity_verification?: string;
  pan_card?: string;
  gst_certificate?: string;
  trade_license?: string;
  // Schema field aliases
  name?: string;
  slug?: string;
  legal_name?: string;
  business_type?: string;
  phone?: string;
  email?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  business_registration_number?: string;
  date_of_birth?: string;
  gender?: string;
}

interface BusinessState {
  businesses: any[];
  currentBusiness: any | null;
  onboardingRequests: any[];
  onboardingForm: OnboardingFormState;
  loading: boolean;
  error: string | null;
}

const initialFormState: OnboardingFormState = {
  ownerName: '',
  ownerEmail: '',
  ownerPhone: '',
  ownerPassword: '',
  businessName: '',
  businessSlug: '',
  businessLegalName: '',
  businessType: 'restaurant',
  businessEmail: '',
  businessWebsite: '',
  address: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  gstin: '',
  pan: '',
  name: '',
  slug: '',
  legal_name: '',
  business_type: 'restaurant',
  phone: '',
  email: '',
  website: '',
  address_line1: '',
  address_line2: '',
  business_registration_number: '',
  date_of_birth: '',
  gender: ''
};

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  onboardingRequests: [],
  onboardingForm: initialFormState,
  loading: false,
  error: null,
};

export const fetchOnboardingRequests = createAsyncThunk(
  'business/fetchOnboardingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/business/onboarding');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch onboarding requests');
    }
  },
  {
    condition: (_, { getState }: any) => {
      const { business } = getState();
      if (business.loading) {
        return false; // Prevent duplicate requests
      }
    }
  }
);

export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/business');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch businesses');
    }
  },
  {
    condition: (_, { getState }: any) => {
      const { business } = getState();
      if (business.loading) {
        return false;
      }
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  'business/fetchBusinessById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/business/${id}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch business details');
    }
  }
);

export const resetBusinessOwnerPassword = createAsyncThunk(
  'business/resetPassword',
  async ({ id, newPassword }: { id: string, newPassword?: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/business/${id}/reset-password`, { newPassword });
      return response.data; // { message: string, newPassword: string }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || 'Failed to reset password'
      );
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async ({ id, data }: { id: string, data: any }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/business/${id}`, data);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update business');
    }
  }
);

export const provisionBusiness = createAsyncThunk(
  'business/provision',
  async (data: OnboardingFormState, { rejectWithValue }) => {
    try {
      const bName = data.businessName || data.name || '';
      const bSlug = data.businessSlug || data.slug || '';
      const bLegalName = data.businessLegalName || data.legal_name || bName;
      const bType = data.businessType || data.business_type || 'restaurant';
      const bEmail = data.businessEmail || data.email || '';
      const bWebsite = data.businessWebsite || data.website || '';
      const addr1 = data.address || data.address_line1 || '';
      const addr2 = data.addressLine2 || data.address_line2 || '';

      const payload = {
        ...data,
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone || data.phone || '',
        ownerPassword: data.ownerPassword,
        businessName: bName,
        businessSlug: bSlug,
        businessLegalName: bLegalName,
        businessType: bType,
        businessEmail: bEmail,
        businessWebsite: bWebsite,
        address: addr1,
        addressLine2: addr2,
        name: bName,
        slug: bSlug,
        legal_name: bLegalName,
        business_type: bType,
        email: bEmail,
        website: bWebsite,
        address_line1: addr1,
        address_line2: addr2
      };

      const response = await axiosInstance.post('/business/provision', payload);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.response?.data?.error || 'Failed to provision business');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    updateOnboardingForm: (state, action: PayloadAction<Partial<OnboardingFormState>>) => {
      state.onboardingForm = { ...state.onboardingForm, ...action.payload };
    },
    resetOnboardingForm: (state) => {
      state.onboardingForm = initialFormState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Requests
      .addCase(fetchOnboardingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboardingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.onboardingRequests = action.payload;
      })
      .addCase(fetchOnboardingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Businesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses = action.payload;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Provision
      .addCase(provisionBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(provisionBusiness.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.businesses.unshift(action.payload);
        }
        state.onboardingForm = initialFormState; // reset form on success
      })
      .addCase(provisionBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Business by ID
      .addCase(fetchBusinessById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Business
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBusiness = action.payload;
        // Optionally update the business in the businesses array
        const index = state.businesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateOnboardingForm, resetOnboardingForm } = businessSlice.actions;
export default businessSlice.reducer;
