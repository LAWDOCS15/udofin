import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { LoanRecord } from "@/types";
import { nbfcAPI } from "@/config/api";

// ─── Async Thunk: Fetch NBFC Leads ─────────────────────────────────────────

export const fetchNBFCLeads = createAsyncThunk(
  "nbfc/fetchLeads",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await nbfcAPI.getLeads();

      const mappedData: LoanRecord[] = data.applications.map((app: any) => ({
        id: app._id.substring(app._id.length - 6).toUpperCase(),
        applicantName: app.borrowerId.name,
        amount: app.aiChatData?.requestedAmount || 500000,
        emi: 15000,
        status:
          app.verificationStatus === "PENDING" ? "pending-emi" : "running",
        rate: 11.5,
        appliedDate: new Date(app.createdAt).toISOString().split("T")[0],
        disbursedDate: "Pending",
        maturityDate: "Pending",
        cibil: 750,
        nextEMIDue: "-",
        emiPaid: 0,
        totalEMI: 36,
      }));

      return mappedData;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      return rejectWithValue(message);
    }
  },
);

// ─── State Interface ────────────────────────────────────────────────────────

interface NBFCState {
  loanRecords: LoanRecord[];
  isLoading: boolean;
  error: string | null;
  selectedLoan: LoanRecord | null;
}

const initialState: NBFCState = {
  loanRecords: [],
  isLoading: true,
  error: null,
  selectedLoan: null,
};

// ─── Slice ──────────────────────────────────────────────────────────────────

const nbfcSlice = createSlice({
  name: "nbfc",
  initialState,
  reducers: {
    setSelectedLoan(state, action: PayloadAction<LoanRecord | null>) {
      state.selectedLoan = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNBFCLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNBFCLeads.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loanRecords = action.payload;
      })
      .addCase(fetchNBFCLeads.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedLoan, clearError } = nbfcSlice.actions;
export default nbfcSlice.reducer;
