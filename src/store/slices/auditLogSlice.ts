import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { AuditLog } from '@/types';

interface AuditLogState {
  logs: AuditLog[];
  loading: boolean;
  error: string | null;
}

const initialState: AuditLogState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchAuditLogs = createAsyncThunk(
  'auditLog/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/audit-logs');
      
      const mappedLogs: AuditLog[] = res.data.data.map((log: any) => ({
        id: log.id,
        eventId: log.id.substring(0, 10).toUpperCase(),
        timestamp: log.created_at,
        timezone: 'UTC', // Defaulting as it's not present in the raw data
        category: log.type || 'System',
        action: log.action,
        module: log.type || 'System',
        userId: log.actor_id || 'system-0',
        username: log.actor_name || 'System',
        userRole: log.actor_role || 'Unknown',
        recordName: log.type,
        recordId: log.business_id,
        severity: log.severity || 'info',
        status: 'success',
        device: {
          ipAddress: log.ip_address || '192.168.1.1',
          deviceName: log.terminal || 'API Gateway',
          deviceType: 'desktop', // Default to desktop if unavailable
          browser: 'Unknown',
          os: 'Unknown'
        },
        remarks: log.details,
      }));
      return mappedLogs;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch audit logs');
    }
  }
);

const auditLogSlice = createSlice({
  name: 'auditLog',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action: PayloadAction<AuditLog[]>) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default auditLogSlice.reducer;
