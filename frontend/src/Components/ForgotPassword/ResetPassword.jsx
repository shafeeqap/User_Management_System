import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { useFormik } from "formik";
import { useResetPasswordMutation } from "../../features/user/usersApiSlice";
import { resetPasswordValidation } from "../../utils/validation/resetPasswordValidation.js";
import { closeForgotPasswordModal } from "../../features/modal/modalSlice.js";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import { useDispatch } from "react-redux";

const ResetPassword = ({ email }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      password: "",
      cPassword: "",
    },
    validationSchema: resetPasswordValidation,
    onSubmit: async (values) => {
      try {
        const res = await resetPassword({
          email,
          newPassword: values.password,
        }).unwrap();
        console.log(res, "resetPassword response");
        toast.success("Password reset successfully!");
        dispatch(closeForgotPasswordModal());
      } catch (error) {
        console.log(error?.data?.message || error.error);
        toast.error(error?.data?.message || "An error occurred during login.");
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3 relative">
          <input
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            type="password"
            placeholder="Enter your new password"
            className="border-b-2 text-black w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <IoLockClosedOutline />
          </div>
          {formik.errors.password && formik.touched.password && (
            <small className="text-red-500">{formik.errors.password}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={formik.handleChange}
            value={formik.values.cPassword}
            name="cPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            className="border-b-2 text-black w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 right-2 max-sm:hidden text-black">
            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
            >
              {showPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
            </button>
          </div>
          <div className="absolute top-1 left-0 text-gray-400">
            <IoLockClosedOutline />
          </div>
          {formik.errors.cPassword && formik.touched.cPassword && (
            <small className="text-red-500">{formik.errors.cPassword}</small>
          )}
        </div>
        <div className="py-5 text-center">
          {isLoading && <Loader />}
          <button
            type="submit"
            className="bg-blue-500 uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-200"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
