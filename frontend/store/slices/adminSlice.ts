import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { LoanApplication } from "@/types";
import { adminAPI } from "@/config/api";

// ─── Async Thunk: Create NBFC + Admin ──────────────────────────────────────

export const createNBFCPartner = createAsyncThunk(
  "admin/createNBFCPartner",
  async (
    payload: {
      nbfcName: string;
      registrationNumber: string;
      adminName: string;
      adminEmail: string;
      adminPassword: string;
    },
    { rejectWithValue },
  ) => {
    try {
      // Step 1: Create NBFC
      const { data: nbfcData } = await adminAPI.createNBFC({
        name: payload.nbfcName,
        registrationNumber: payload.registrationNumber,
      });
      const newNbfcId = nbfcData.nbfc._id;

      // Step 2: Create Admin linked to NBFC
      const { data: adminData } = await adminAPI.createNBFCAdmin({
        name: payload.adminName,
        email: payload.adminEmail,
        password: payload.adminPassword,
        nbfcId: newNbfcId,
      });

      return { nbfc: nbfcData.nbfc, admin: adminData };
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Something went wrong";
      return rejectWithValue(message);
    }
  },
);

// ─── State Interface ────────────────────────────────────────────────────────

interface AdminState {
  loanApplications: LoanApplication[];
  isLoading: boolean;
  error: string | null;
  isCreatingPartner: boolean;
  createPartnerError: string | null;
}

const initialState: AdminState = {
  loanApplications: [
    { id: "APP001", applicantName: "Virendra Singh", amount: 800000, status: "approved", rate: 10.5, appliedDate: "Today", cibil: 758 },
    { id: "APP002", applicantName: "Priya Sharma", amount: 500000, status: "pending", rate: 11.25, appliedDate: "Yesterday", cibil: 745 },
    { id: "APP003", applicantName: "Rajesh Kumar", amount: 1000000, status: "disbursed", rate: 9.75, appliedDate: "2 days ago", cibil: 780 },
    { id: "APP004", applicantName: "Anjali Patel", amount: 600000, status: "pending", rate: 11.5, appliedDate: "3 days ago", cibil: 720 },
    { id: "APP005", applicantName: "Arjun Verma", amount: 450000, status: "rejected", rate: 12.0, appliedDate: "4 days ago", cibil: 680 },
  ],
  isLoading: false,
  error: null,
  isCreatingPartner: false,
  createPartnerError: null,
};

// ─── Slice ──────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
      state.createPartnerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNBFCPartner.pending, (state) => {
        state.isCreatingPartner = true;
        state.createPartnerError = null;
      })
      .addCase(createNBFCPartner.fulfilled, (state) => {
        state.isCreatingPartner = false;
      })
      .addCase(createNBFCPartner.rejected, (state, action) => {
        state.isCreatingPartner = false;
        state.createPartnerError = action.payload as string;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
