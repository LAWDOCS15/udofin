import api from "@/config/axios";
import type { 
  UserLoan, 
  EMIEntry, 
  UserNotification, 
  UserDashboardStats, 
  KYCDocument, 
  SupportTicket 
} from "@/types";

// ─── User API Service ───────────────────────────────────────────────────────
// All user-facing endpoints.
// Usage: import { userAPI } from "@/config/api"
//        const { data } = await userAPI.getLoans()

export const userAPI = {
  // ── Dashboard ─────────────────────────────────────────────────────────
  getDashboard: () =>
    api.get<{ stats: UserDashboardStats }>("/api/user/dashboard"),

  // ── Loans ─────────────────────────────────────────────────────────────
  getLoans: () =>
api.get<{ loans: UserLoan[] }>("/api/applications/my-applications"),

  getLoanById: (loanId: string) =>
    api.get<{ loan: UserLoan }>(`/api/user/loans/${loanId}`),

  // ── Loan Application ──────────────────────────────────────────────────
  applyLoan: (payload: {
    loanType: string; amount: number; tenure: number; purpose?: string;
    fullName: string; dob: string; gender: string; pan: string; aadhaar: string;
    email: string; phone: string; address?: string; city?: string; state?: string; pincode?: string;
    employmentType: string; companyName?: string; designation?: string;
    monthlyIncome: number; experience?: number;
    bankName: string; accountNumber: string; ifsc: string;
  }) =>
    api.post<{ application: { id: string } }>("/api/user/loans/apply", payload),

  // ── EMI Calendar ──────────────────────────────────────────────────────
  getEMIs: (params?: { month?: number; year?: number }) =>
    api.get<{ emis: EMIEntry[] }>("/api/user/emis", { params }),

  // ── Documents ─────────────────────────────────────────────────────────
  getDocuments: () =>
    api.get<{ documents: KYCDocument[] }>("/api/user/documents"),

  uploadDocument: (formData: FormData) =>
    api.post<{ document: KYCDocument }>("/api/user/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteDocument: (docId: string) =>
    api.delete(`/api/user/documents/${docId}`),

  // ── Notifications ─────────────────────────────────────────────────────
  getNotifications: () =>
    api.get<{ notifications: UserNotification[] }>("/api/user/notifications"),

  markNotificationRead: (notifId: string) =>
    api.patch(`/api/user/notifications/${notifId}/read`),

  markAllNotificationsRead: () =>
    api.patch("/api/user/notifications/read-all"),

  // ── Profile ───────────────────────────────────────────────────────────
  getProfile: () =>
    api.get("/api/user/profile"),

  updateProfile: (payload: Record<string, string>) =>
    api.put("/api/user/profile", payload),

  updatePassword: (payload: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    api.put("/api/user/profile/password", payload),

  // ── Support Tickets ───────────────────────────────────────────────────
  getTickets: () =>
    api.get<{ tickets: SupportTicket[] }>("/api/user/support"),

  createTicket: (payload: { subject: string; description: string }) =>
    api.post<{ ticket: SupportTicket }>("/api/user/support", payload),

  replyToTicket: (ticketId: string, message: string) =>
    api.post(`/api/user/support/${ticketId}/reply`, { message }),
};