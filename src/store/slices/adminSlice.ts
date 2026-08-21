import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

export interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  businesses_count: number;
  businesses: {
    id: string;
    name: string;
    status: string;
    is_active: boolean;
  }[];
}

interface AdminState {
  admins: Admin[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  admins: [],
  isLoading: false,
  error: null,
};

export const fetchAdmins = createAsyncThunk(
  'admin/fetchAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/admin`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch admins');
    }
  }
);

export const updateAdminStatus = createAsyncThunk(
  'admin/updateAdminStatus',
  async ({ id, is_active }: { id: string; is_active: boolean }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/admin/${id}`, { is_active });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update admin');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action: PayloadAction<Admin[]>) => {
        state.isLoading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminStatus.fulfilled, (state, action) => {
        const index = state.admins.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.admins[index].is_active = action.payload.is_active;
        }
      });
  },
});

export default adminSlice.reducer;
