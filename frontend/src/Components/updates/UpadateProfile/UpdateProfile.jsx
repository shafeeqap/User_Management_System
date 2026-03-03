import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { updateProfileValidation } from "../../../utils/validation/updateProfileValidation.js";
import { TfiEmail } from "react-icons/tfi";
import { FiUser } from "react-icons/fi";
import { FiSmartphone } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUpdateUserMutation } from "../../../features/user/usersApiSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../../features/auth/authSlice.js";
import Loader from "../../Loader/Loader.jsx";

const UpdateProfile = ( {handleProfileModalClose} ) => {
  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [isModified, setIsModified] = useState(false);
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    email: userInfo.email,
    mobile: userInfo.mobile,
  });

  useEffect(() => {
    setInitialValues({
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      mobile: userInfo.mobile,
    });
  }, [userInfo]);


  const hasChanges = (values) => {
    return (
      values.firstName !== initialValues.firstName ||
      values.lastName !== initialValues.lastName ||
      values.email !== initialValues.email ||
      values.mobile !== initialValues.mobile
    );
  }

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      mobile: userInfo.mobile,
    },
    validationSchema: updateProfileValidation,
    enableReinitialize: true,
    onSubmit: async (formValues) => {
      
      try {
        const res = await toast.promise(updateProfile(formValues).unwrap(), {
          pending: "Updating...",
          success: "Updation successful!",
          error: "Updation failed!",
        });
        console.log(res);
        dispatch(setCredentials({ ...res }));
        handleProfileModalClose();
      } catch (error) {
        console.log(error);
        toast.error(
          error?.data?.message || "An error occurred during register."
        );
      }
    },
  });

  useEffect(() => {
    setIsModified(hasChanges(values));
  }, [values]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="firstName"
            value={values.firstName}
            type="text"
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <FiUser />
          </div>
          {errors.firstName && touched.firstName && (
            <small className="text-red-500">{errors.firstName}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            name="lastName"
            type="text"
            value={values.lastName}
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <FiUser />
          </div>
          {errors.lastName && touched.lastName && (
            <small className="text-red-500">{errors.lastName}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="email"
            name="email"
            value={values.email}
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <TfiEmail />
          </div>
          {errors.email && touched.email && (
            <small className="text-red-500">{errors.email}</small>
          )}
        </div>
        <div className="mb-3 relative">
          <input
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            name="mobile"
            value={values.mobile}
            className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
          />
          <div className="absolute top-1 left-0 text-gray-400">
            <FiSmartphone />
          </div>
          {errors.mobile && touched.mobile && (
            <small className="text-red-500">{errors.mobile}</small>
          )}
        </div>
        <div className="py-5 text-center">
          <div className="flex justify-center">{isLoading && <Loader /> }</div>
          <button
            type="submit"
            disabled={isLoading || !isModified} 
            className={`bg-blue-500 text-white uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-200 cursor-pointer ${
              (!isModified || isLoading) && "cursor-not-allowed opacity-50"
            }`}
          >
            update
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateProfile;
