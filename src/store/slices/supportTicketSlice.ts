import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';
import { SupportTicket } from '@/types';

interface SupportTicketState {
  tickets: SupportTicket[];
  currentTicket: SupportTicket | null;
  loading: boolean;
  error: string | null;
}

const initialState: SupportTicketState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
};

export const fetchSupportTickets = createAsyncThunk(
  'supportTicket/fetchSupportTickets',
  async (params: { search?: string; status?: string; priority?: string } | undefined, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.priority) queryParams.append('priority', params.priority);
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const res = await axiosInstance.get(`/support-ticket${queryString}`);
      
      // Backend returns an array directly: res.data
      const dataArray = Array.isArray(res.data) ? res.data : (res.data.data || []);

      const mappedTickets: SupportTicket[] = dataArray.map((ticket: any) => ({
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        businessId: ticket.business_id,
        businessName: ticket.business?.name || 'Unknown Business',
        branchName: ticket.branch?.name,
        contactPerson: ticket.business?.name || 'Unknown Contact',
        contactEmail: ticket.business?.email || 'unknown@example.com',
        subject: ticket.subject,
        description: ticket.description || '',
        category: 'technical', // default if not provided by backend
        status: ticket.status,
        priority: ticket.priority,
        slaBreached: ticket.sla_breached,
        csatScore: ticket.csat_score ? parseFloat(ticket.csat_score) : undefined,
        resolutionTimeHrs: ticket.resolution_time_hrs ? parseFloat(ticket.resolution_time_hrs) : undefined,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        messages: [],
        internalNotes: []
      }));
      return mappedTickets;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch support tickets');
    }
  }
);

export const fetchSupportTicketById = createAsyncThunk(
  'supportTicket/fetchSupportTicketById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/support-ticket/${id}`);
      const ticket = res.data;
      
      const mappedTicket: SupportTicket = {
        id: ticket.id,
        ticketNumber: ticket.ticket_number,
        businessId: ticket.business_id,
        businessName: ticket.business?.name || 'Unknown Business',
        branchName: ticket.branch?.name,
        contactPerson: ticket.business?.name || 'Unknown Contact',
        contactEmail: ticket.business?.email || 'unknown@example.com',
        subject: ticket.subject,
        description: ticket.description || '',
        category: 'technical',
        status: ticket.status,
        priority: ticket.priority,
        slaBreached: ticket.sla_breached,
        csatScore: ticket.csat_score ? parseFloat(ticket.csat_score) : undefined,
        resolutionTimeHrs: ticket.resolution_time_hrs ? parseFloat(ticket.resolution_time_hrs) : undefined,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        messages: [],
        internalNotes: []
      };
      
      return mappedTicket;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch support ticket');
    }
  }
);

export const updateSupportTicket = createAsyncThunk(
  'supportTicket/updateSupportTicket',
  async ({ id, data }: { id: string; data: Partial<SupportTicket> }, { rejectWithValue }) => {
    try {
      await axiosInstance.put(`/support-ticket/${id}`, data);
      return { id, data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update support ticket');
    }
  }
);

const supportTicketSlice = createSlice({
  name: 'supportTicket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTickets.fulfilled, (state, action: PayloadAction<SupportTicket[]>) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSupportTicketById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupportTicketById.fulfilled, (state, action: PayloadAction<SupportTicket>) => {
        state.loading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchSupportTicketById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSupportTicket.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        if (state.currentTicket && state.currentTicket.id === id) {
          state.currentTicket = { ...state.currentTicket, ...data };
        }
        const index = state.tickets.findIndex(t => t.id === id);
        if (index !== -1) {
          state.tickets[index] = { ...state.tickets[index], ...data };
        }
      });
  },
});

export default supportTicketSlice.reducer;
