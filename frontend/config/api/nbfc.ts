// import api from "@/config/axios";
// import type {
//   NBFCApplication, NBFCCustomer, NBFCDashboardStats,
//   NBFCEMIRecord, NBFCDisbursement, NBFCStaffMember,
// } from "@/types";

// // ─── NBFC Admin API Service ─────────────────────────────────────────────────
// // Usage: import { nbfcAPI } from "@/config/api"
// //        const { data } = await nbfcAPI.getApplications()

// export const nbfcAPI = {
//   // ── Dashboard ─────────────────────────────────────────────────────────
//   getDashboard: () =>
//     api.get<{ stats: NBFCDashboardStats }>("/api/nbfc/dashboard"),

//   // ── Applications / Leads ──────────────────────────────────────────────
//   getApplications: (params?: { status?: string; search?: string; page?: number }) =>
//     api.get<{ applications: NBFCApplication[] }>("/api/nbfc/applications", { params }),

//   getLeads: () =>
//     api.get("/api/applications/leads"),

//   getApplicationById: (appId: string) =>
//     api.get<{ application: NBFCApplication }>(`/api/nbfc/applications/${appId}`),

//   approveApplication: (appId: string, payload: { interestRate: number; tenure: number; emiAmount: number }) =>
//     api.patch(`/api/nbfc/applications/${appId}/approve`, payload),

//   rejectApplication: (appId: string, reason: string) =>
//     api.patch(`/api/nbfc/applications/${appId}/reject`, { reason }),

//   // ── Customers ─────────────────────────────────────────────────────────
//   getCustomers: (params?: { search?: string; riskLevel?: string; page?: number }) =>
//     api.get<{ customers: NBFCCustomer[] }>("/api/nbfc/customers", { params }),

//   getCustomerById: (customerId: string) =>
//     api.get<{ customer: NBFCCustomer }>(`/api/nbfc/customers/${customerId}`),

//   // ── EMI Tracker ───────────────────────────────────────────────────────
//   getEMIs: (params?: { status?: string; search?: string; page?: number }) =>
//     api.get<{ emis: NBFCEMIRecord[] }>("/api/nbfc/emis", { params }),

//   sendEMIReminder: (emiId: string) =>
//     api.post(`/api/nbfc/emis/${emiId}/remind`),

//   // ── Disbursements ─────────────────────────────────────────────────────
//   getDisbursements: (params?: { status?: string; page?: number }) =>
//     api.get<{ disbursements: NBFCDisbursement[] }>("/api/nbfc/disbursements", { params }),

//   processDisbursement: (disbId: string) =>
//     api.patch(`/api/nbfc/disbursements/${disbId}/process`),

//   // ── Staff ─────────────────────────────────────────────────────────────
//   getStaff: () =>
//     api.get<{ staff: NBFCStaffMember[] }>("/api/nbfc/staff"),

//   addStaff: (payload: { name: string; email: string; role: string; password: string }) =>
//     api.post("/api/nbfc/staff", payload),

//   updateStaffStatus: (staffId: string, status: "active" | "inactive") =>
//     api.patch(`/api/nbfc/staff/${staffId}/status`, { status }),

//   // ── Reports ───────────────────────────────────────────────────────────
//   getReports: (params?: { type?: string; from?: string; to?: string }) =>
//     api.get("/api/nbfc/reports", { params }),

//   // ── Settings ──────────────────────────────────────────────────────────
//   getSettings: () =>
//     api.get("/api/nbfc/settings"),

//   updateSettings: (payload: Record<string, unknown>) =>
//     api.put("/api/nbfc/settings", payload),
// };





// // frontend/config/api/nbfc.ts
// import api from "@/config/axios";

// export const nbfcAPI = {
//   getLeads: () => api.get("/api/applications/leads"),
//   updateApplicationStatus: (appId: string, payload: any) => api.patch(`/api/applications/${appId}/status`, payload),
// };





import api from "@/config/axios";

export const nbfcAPI = {
  // 1. Applications & Leads
  getLeads: () => api.get("/api/applications/leads"),
  
  // 2. Customers List (Active Customers)
  getCustomers: () => api.get("/api/nbfc/customers"), 

  // 3. Dashboard Stats (Summary counts)
  getStats: () => api.get("/api/nbfc/stats"), 

  // 4. Loan Disbursement
  disburseLoan: (applicationId: string) => 
    api.post("/api/nbfc/disburse", { applicationId }),

  // 5. EMI Management
  // Dashboard ke chote card ke liye
  getUpcomingEmis: () => api.get("/api/nbfc/emis/upcoming"),
  
  // EMI Tracker Page ke liye (Full Data)
  getTrackerData: () => api.get("/api/nbfc/emis/tracker"),

  // EMI Payment Update
  markEmiAsPaid: (emiId: string, paymentData: { paymentMethod: string; transactionId: string }) => 
    api.patch("/api/nbfc/emis/pay", { emiId, ...paymentData }),

  // 6. Application Status (General Updates)
  updateApplicationStatus: (appId: string, payload: any) => 
    api.patch(`/api/applications/${appId}/status`, payload),
};