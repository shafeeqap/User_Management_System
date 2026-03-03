import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import modalReducer from "../features/modal/modalSlice.js";
import adminReducer from "../features/admin/adminSlice.js";
import { apiSlice } from "../services/apiSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    modal: modalReducer,
    admin: adminReducer,
    [apiSlice.reducerPath] : apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
