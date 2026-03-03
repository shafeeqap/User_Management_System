import { useState } from 'react'
import { useFormik } from "formik";
import { IoLockClosedOutline } from "react-icons/io5";
import { updatePasswordValidation } from '../../../utils/validation/updatePasswordValidation.js';
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUpdatePasswordMutation } from '../../../features/user/usersApiSlice.js';
import { setCredentials } from '../../../features/auth/authSlice.js';
import { useDispatch } from 'react-redux';
import Loader from '../../Loader/Loader.jsx';

const UpdatePassword = ({handlePasswordModalClose}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      cPassword: ""
    },
    validationSchema: updatePasswordValidation,
    onSubmit: async(values) =>{
      try {
        const res = await toast.promise(updatePassword(values).unwrap(), {
          pending: "Updating password...",
          success: "Password updated successfully!",
          error: "Password update failed!",
        });
        console.log(res);
        dispatch(setCredentials({...res}))
        handlePasswordModalClose();
      } catch (error) {
        console.log(error);
        toast.error(error?.data?.message || "An error occurred during password update.");
      }
    }
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
      <div className="mb-3 relative">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="currentPassword"
            type="password"
            value={formik.values?.currentPassword}
            placeholder="Current Password"
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <IoLockClosedOutline />
          </div>
          {formik.errors.currentPassword && formik.touched.currentPassword && (
            <small className="text-red-500">{formik.errors.currentPassword}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="newPassword"
            type="password"
            value={formik.values?.newPassword}
            placeholder="New Password"
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <IoLockClosedOutline />
          </div>
          {formik.errors.newPassword && formik.touched.newPassword && (
            <small className="text-red-500">{formik.errors.newPassword}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="cPassword"
            type={showPassword ? "text" : "password"}
            value={formik.values?.cPassword}
            placeholder="Confirm password"
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 right-2 max-sm:hidden">
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
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-200"
          >
            {isLoading ? <Loader /> : "Update Password"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  )
}

export default UpdatePassword;