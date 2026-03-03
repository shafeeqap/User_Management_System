import * as Yup from "yup";

export const updateProfileValidation = Yup.object({
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
  mobile: Yup.string()
  .matches(/^(?!(\d)\1{9})[5-9]\d{9}$/, "Invalid mobile number")
  .required("Please enter mobile number"),
});
