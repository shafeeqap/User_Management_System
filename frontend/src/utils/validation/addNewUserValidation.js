import * as Yup from "yup";

export const addNewUserValidation = Yup.object({
  firstName: Yup.string()
    .min(3)
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Name cannot have adjacent spaces")
    .required("Please enter your first name"),
  lastName: Yup.string()
    .min(3)
    .matches(/^[^\s]+(\s[^\s]+)*$/, "Name cannot have adjacent spaces")
    .required("Please enter your last name"),
  email: Yup.string()
    .email("Please enter valid email")
    .required("Please enter your email"),
  password: Yup.string()
    .matches(/^[^\s]+$/, "Password cannot contain spaces")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Please enter your password")
    .min(6),
  cPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Password not matched")
    .required("Please enter confirm password"),
});
