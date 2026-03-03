import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// ─── State Interface ────────────────────────────────────────────────────────

interface UIState {
  // NBFC Panel
  nbfcActiveTab: "overview" | "loans" | "users";
  nbfcSearch: string;
  nbfcFilterStatus: "all" | "running" | "completed" | "pending-emi" | "overdue";

  // Admin Panel
  adminActiveTab: "overview" | "applications" | "reports";
  adminSearch: string;
  showAddPartnerModal: boolean;
}

const initialState: UIState = {
  nbfcActiveTab: "overview",
  nbfcSearch: "",
  nbfcFilterStatus: "all",

  adminActiveTab: "overview",
  adminSearch: "",
  showAddPartnerModal: false,
};

// ─── Slice ──────────────────────────────────────────────────────────────────

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // NBFC
    setNBFCActiveTab(state, action: PayloadAction<UIState["nbfcActiveTab"]>) {
      state.nbfcActiveTab = action.payload;
    },
    setNBFCSearch(state, action: PayloadAction<string>) {
      state.nbfcSearch = action.payload;
    },
    setNBFCFilterStatus(state, action: PayloadAction<UIState["nbfcFilterStatus"]>) {
      state.nbfcFilterStatus = action.payload;
    },

    // Admin
    setAdminActiveTab(state, action: PayloadAction<UIState["adminActiveTab"]>) {
      state.adminActiveTab = action.payload;
    },
    setAdminSearch(state, action: PayloadAction<string>) {
      state.adminSearch = action.payload;
    },
    setShowAddPartnerModal(state, action: PayloadAction<boolean>) {
      state.showAddPartnerModal = action.payload;
    },
  },
});

export const {
  setNBFCActiveTab,
  setNBFCSearch,
  setNBFCFilterStatus,
  setAdminActiveTab,
  setAdminSearch,
  setShowAddPartnerModal,
} = uiSlice.actions;

export default uiSlice.reducer;
