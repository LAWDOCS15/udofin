import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { UserLoan, UserNotification, UserDashboardStats } from "@/types";
import { userAPI } from "@/config/api";

// ─── State Interface ────────────────────────────────────────────────────────

interface UserState {
  loans: UserLoan[];
  notifications: UserNotification[];
  stats: UserDashboardStats | null;
  loading: boolean;
  error: string | null;
  activeTab: "overview" | "loans" | "emis";
}

const initialState: UserState = {
  loans: [],
  notifications: [],
  stats: null,
  loading: false,
  error: null,
  activeTab: "overview",
};

// ─── Async Thunks ───────────────────────────────────────────────────────────

export const fetchUserLoans = createAsyncThunk(
  "user/fetchLoans",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.getLoans();
      return data.loans as UserLoan[];
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to fetch loans";
      return rejectWithValue(message);
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "user/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await userAPI.getDashboard();
      return data.stats as UserDashboardStats;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Failed to fetch stats";
      return rejectWithValue(message);
    }
  }
);

// ─── Slice ──────────────────────────────────────────────────────────────────

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserActiveTab(state, action: PayloadAction<UserState["activeTab"]>) {
      state.activeTab = action.payload;
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserLoans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserLoans.fulfilled, (state, action) => {
        state.loading = false;
        state.loans = action.payload;
      })
      .addCase(fetchUserLoans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setUserActiveTab, markNotificationRead, clearError } =
  userSlice.actions;

export default userSlice.reducer;
