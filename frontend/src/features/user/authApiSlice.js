import { apiSlice } from "../../services/apiSlice";

const AUTH_URL = 'http://localhost:5000/auth/'
const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleLogin: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/login/success`,
        method: "GET",
        credentials: 'include',
      }),
    }),
  }),
});

export const { useGoogleLoginMutation } = authApiSlice;
export default authApiSlice;