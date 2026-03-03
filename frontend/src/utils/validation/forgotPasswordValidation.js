import * as Yup from "yup";

export const forgotPasswordValidation = Yup.object({
  email: Yup.string()
    .email("Please enter valid email")
    .required("Please enter your email"),
});
