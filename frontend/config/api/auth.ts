// import api from "@/config/axios";

// ─── Auth API Service ───────────────────────────────────────────────────────
// All authentication-related endpoints in one place.
// Usage: import { authAPI } from "@/config/api"
//        const { data } = await authAPI.login({ email, password, otpMethod })

import api from "@/config/axios";

export const authAPI = {
  login: (payload: any) => api.post("/api/auth/login", payload),
  register: (payload: any) => api.post("/api/auth/register", payload),
  verifyEmail: (payload: any) => api.post("/api/auth/verify-email", payload),
  verifyLoginOtp: (payload: any) => api.post("/api/auth/verify-login-otp", payload),
  forgotPassword: (payload: any) => api.post("/api/auth/forgot-password", payload),
  resetPassword: (payload: any) => api.post("/api/auth/reset-password", payload),
  resendOtp: (payload: any) => api.post("/api/auth/resend-otp", payload),
  logout: () => api.post("/api/auth/logout"),
  me: () => api.get("/api/auth/me"),
};