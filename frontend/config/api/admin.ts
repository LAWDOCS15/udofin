// import api from "@/config/axios";
// import type {
//   LoanApplication, AdminDashboardStats, PlatformUser,
//   NBFCPartner, AuditLogEntry, PlatformSettings,
// } from "@/types";

// // ─── Admin (Platform Super-Admin) API Service ───────────────────────────────
// // Usage: import { adminAPI } from "@/config/api"
// //        const { data } = await adminAPI.getDashboard()

// export const adminAPI = {
//   // ── Dashboard ─────────────────────────────────────────────────────────
//   getDashboard: () =>
//     api.get<{ stats: AdminDashboardStats }>("/api/admin/dashboard"),

//   // ── Users ─────────────────────────────────────────────────────────────
//   getUsers: (params?: { search?: string; status?: string; page?: number }) =>
//     api.get<{ users: PlatformUser[]; total: number }>("/api/admin/users", { params }),

//   blockUser: (userId: string) =>
//     api.patch(`/api/admin/users/${userId}/block`),

//   unblockUser: (userId: string) =>
//     api.patch(`/api/admin/users/${userId}/unblock`),

//   // ── Applications ──────────────────────────────────────────────────────
//   getApplications: (params?: { search?: string; status?: string; page?: number }) =>
//     api.get<{ applications: LoanApplication[]; total: number }>("/api/admin/applications", { params }),

//   approveApplication: (appId: string) =>
//     api.patch(`/api/admin/applications/${appId}/approve`),

//   rejectApplication: (appId: string, reason: string) =>
//     api.patch(`/api/admin/applications/${appId}/reject`, { reason }),

//   // ── NBFC Management ───────────────────────────────────────────────────
//   getNBFCs: () =>
//     api.get<{ nbfcs: NBFCPartner[] }>("/api/admin/nbfcs"),

//   createNBFC: (payload: { name: string; registrationNumber: string }) =>
//     api.post<{ nbfc: NBFCPartner }>("/api/admin/create-nbfc", payload),

//   createNBFCAdmin: (payload: { name: string; email: string; password: string; nbfcId: string }) =>
//     api.post("/api/admin/create-nbfc-admin", payload),

//   suspendNBFC: (nbfcId: string) =>
//     api.patch(`/api/admin/nbfcs/${nbfcId}/suspend`),

//   activateNBFC: (nbfcId: string) =>
//     api.patch(`/api/admin/nbfcs/${nbfcId}/activate`),

//   // ── Audit Logs ────────────────────────────────────────────────────────
//   getAuditLogs: (params?: { page?: number; action?: string }) =>
//     api.get<{ logs: AuditLogEntry[]; total: number }>("/api/admin/audit-logs", { params }),

//   // ── Settings ──────────────────────────────────────────────────────────
//   getSettings: () =>
//     api.get<{ settings: PlatformSettings }>("/api/admin/settings"),

//   updateSettings: (payload: Partial<PlatformSettings>) =>
//     api.put("/api/admin/settings", payload),

//   // ── Reports ───────────────────────────────────────────────────────────
//   getReports: (params?: { type?: string; from?: string; to?: string }) =>
//     api.get("/api/admin/reports", { params }),

//   // ── Support Tickets ───────────────────────────────────────────────────
//   getSupportTickets: (params?: { status?: string; page?: number }) =>
//     api.get("/api/admin/support-tickets", { params }),

//   replyToTicket: (ticketId: string, message: string) =>
//     api.post(`/api/admin/support-tickets/${ticketId}/reply`, { message }),

//   closeTicket: (ticketId: string) =>
//     api.patch(`/api/admin/support-tickets/${ticketId}/close`),
// };



// frontend/config/api/admin.ts
import api from "@/config/axios";

export const adminAPI = {
  getDashboardData: () => api.get("/api/admin/dashboard-data"),
  
  // Naya endpoint NBFCs ki list laane ke liye
  getNbfcs: () => api.get("/api/admin/nbfcs"), 
  
  createNbfc: (payload: any) => api.post("/api/admin/create-nbfc", payload),
  createNbfcAdmin: (payload: any) => api.post("/api/admin/create-nbfc-admin", payload),
};