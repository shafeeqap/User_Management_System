import { retry } from "@reduxjs/toolkit/query";
import { apiSlice } from "../../services/apiSlice";
const USERS_URL = "api/users";



export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: "GET",
      }),
    }),
    uploadProfileImage: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profileImage`,
        method: "POST",
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/updatePassword`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteProfileImage: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profileImage`,
        method: "DELETE",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: `${USERS_URL}/forgotPassword`,
        method: "POST",
        body: email,
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({email, otp}) =>({
        url: `${USERS_URL}/verifyOTP`,
        method: "POST",
        body: {email, otp},
      })
    }),
    resetPassword: builder.mutation({
      query: ({ email, newPassword }) => ({
        url: `${USERS_URL}/resetPassword`,
        method: "POST",
        body: { email, newPassword },
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) =>({
        url: `${USERS_URL}/resendOtp`,
        method: "POST",
        body: email,
      })
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useUploadProfileImageMutation,
  useGetUserQuery,
  useDeleteProfileImageMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
  useResendOtpMutation,
} = userApiSlice;
