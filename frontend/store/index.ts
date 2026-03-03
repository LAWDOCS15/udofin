import { configureStore } from "@reduxjs/toolkit";
import nbfcReducer from "./slices/nbfcSlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    nbfc: nbfcReducer,
    admin: adminReducer,
    ui: uiReducer,
    user: userReducer,
  },
});

// Infer types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
