// import axios from "axios";

// // ─── Central Axios Instance ─────────────────────────────────────────────────
// // All API calls go through this single instance.
// // • baseURL comes from .env.local → NEXT_PUBLIC_API_URL
// // • withCredentials: true  → cookies (JWT httpOnly) sent automatically
// // • Interceptors handle token refresh & global error logging

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ─── Request Interceptor ────────────────────────────────────────────────────
// // Attach auth token from localStorage if available (for non-cookie setups)
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ─── Response Interceptor ───────────────────────────────────────────────────
// // Catch 401 → redirect to login, log errors globally
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or unauthorized — redirect to auth
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("token");
//         // Only redirect if not already on auth page
//         if (!window.location.pathname.startsWith("/auth")) {
//           window.location.href = "/auth";
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;



// frontend/config/axios.ts

import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;