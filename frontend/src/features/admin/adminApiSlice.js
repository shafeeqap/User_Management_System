import { apiSlice } from "../../services/apiSlice";
const ADMIN_URL = "api/admin";

const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation({
      query: (credential) => ({
        url: `${ADMIN_URL}/login`,
        method: "POST",
        body: credential,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/logout`,
        method: "POST",
      }),
    }),
    addNewUser: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/create-user`,
        method: "POST",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: `${ADMIN_URL}/users`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/${id}`,
        method: "DELETE",
      }),
    }),
    blockUnblockUser: builder.mutation({
      query: (id) => ({
        url: `${ADMIN_URL}/users/block-unblock/${id}`,
        method: "PATCH",
      }),
    }),
    adminUpdateUser: builder.mutation({
      query: ({id, data}) =>({
        url: `${ADMIN_URL}/users/update-user/${id}`,
        method: "PUT",
        body: data,
      })
    }),
    uploadAdminProfileImage: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/profile`,
        method: "POST",
        body: data,
      }),
    }),
    deleteAdminProfileImage: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/profile`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAddNewUserMutation,
  useGetUsersQuery,
  useAdminUpdateUserMutation,
  useDeleteUserMutation,
  useBlockUnblockUserMutation,
  useUploadAdminProfileImageMutation,
  useDeleteAdminProfileImageMutation,
} = adminApiSlice;
