import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["auth/fetchUsers/fulfilled"], // Ignore specific actions
        ignoredPaths: ["Users.file"], // Ignore specific paths in state
      },
    }),
  reducer: {
    auth: authReducer,
  },
});

export default store;
