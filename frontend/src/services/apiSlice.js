import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";
import { adminLogout } from "../features/admin/adminSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "",
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);


  const url = args.url || ""; // Extract the URL being requested
  

  const isAdminRoute = url.includes("/admin");


  // Handle token expiration for user
  if (result.error && result.error.status === 401 && !isAdminRoute) {
    api.dispatch(logout());
    window.alert("User session expired. Please log in again.");
    window.location.href = "/login";
    return result;
  }

  // Handle token expiration for admin
  if (result.error && result.error.status === 401 && isAdminRoute) {
    api.dispatch(adminLogout());
    window.alert("Admin session expired. Please log in again.");
    window.location.href = "/admin-login";
    return result;
  }

  // Handle blocked users (403 Forbidden)
  if (result.error && result.error.status === 403) {
    api.dispatch(logout());
    window.alert("User is blocked by admin.");
    window.location.href = "/login";
    return result;
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Admin"],
  endpoints: (builder) => ({}),
});
