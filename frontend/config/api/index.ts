// // ─── API Service Barrel Export ───────────────────────────────────────────────
// // Import all API services from one place:
// //   import { authAPI, userAPI, adminAPI, nbfcAPI } from "@/config/api"

// export { authAPI } from "./auth";
// export { userAPI } from "./user";
// export { adminAPI } from "./admin";
// export { nbfcAPI } from "./nbfc";





// export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';


// export const ENDPOINTS = {
//   AUTH: {
//     LOGIN: `${API_BASE_URL}/api/auth/login`,
//     REGISTER: `${API_BASE_URL}/api/auth/register`,
//     ME: `${API_BASE_URL}/api/auth/me`,
//     RESEND_OTP: `${API_BASE_URL}/api/auth/resend-otp`,
//     FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
//     RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
//   },
//   ADMIN: {
//     DASHBOARD: `${API_BASE_URL}/api/admin/dashboard-data`,
//     CREATE_NBFC: `${API_BASE_URL}/api/admin/create-nbfc`,
//     CREATE_NBFC_ADMIN: `${API_BASE_URL}/api/admin/create-nbfc-admin`,
//   },
//   NBFC: {
//     LEADS: `${API_BASE_URL}/api/applications/leads`,
//   }
// };



// frontend/config/api/index.ts

export { authAPI } from "./auth";
export { adminAPI } from "./admin";
export { nbfcAPI } from "./nbfc";
export { userAPI } from "./user"; 

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const formatDocumentUrl = (rawPath?: string) => {
  if (!rawPath) return '#';
  const normalizedPath = rawPath.replace(/\\/g, '/');
  const uploadIndex = normalizedPath.indexOf('uploads/');
  if (uploadIndex !== -1) {
    const relativePath = normalizedPath.substring(uploadIndex);
    return `${API_BASE_URL}/${relativePath}`;
  }
  return `${API_BASE_URL}/${normalizedPath}`;
};