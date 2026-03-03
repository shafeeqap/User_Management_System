import * as Yup from "yup";

export const updatePasswordValidation = Yup.object({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required")
    .test(
      "not-same-as-current",
      "New password must be different from the current password",
      function (value) {
        const { currentPassword } = this.parent;
        return value !== currentPassword;
      }
    ),
  cPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});
