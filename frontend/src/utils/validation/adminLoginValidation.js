import * as Yup from "yup";

export const adminLoginValidation = Yup.object({
    email: Yup.string()
    .email("Please enter valid email")
    .required("Please enter your email"),
    password: Yup.string()
    .matches(/^[^\s]+$/, "Password cannot contain spaces")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .min(6)
    .required("Please enter your password")
});