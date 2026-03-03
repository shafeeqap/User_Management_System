import * as Yup from "yup";


export const resetPasswordValidation = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  cPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});
