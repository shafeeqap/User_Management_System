import { useState } from "react";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { useFormik } from "formik";
import { addNewUserValidation } from "../../../utils/validation/addNewUserValidation.js";
import { IoLockClosedOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { FiUser } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAddNewUserMutation } from "../adminApiSlice.js";
import Loader from "../../../Components/Loader/Loader.jsx";
import { setCredentials } from "../../auth/authSlice.js";
import { useDispatch } from "react-redux";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  cPassword: "",
};

const AddNewUser = ({ handleAddNewUserModalClose, refetchUsers  }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [addNewUser, { isLoading }] = useAddNewUserMutation();
  const dispatch = useDispatch;

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: addNewUserValidation,
      onSubmit: async (values) => {
        try {
          const res = await toast.promise(addNewUser(values).unwrap(), {
            pending: "Registering...",
            success: "Registration successful!",
            error: "Registeration failed!",
          });

          console.log(res, 'response');
          // dispatch(setCredentials({ ...res }));

          refetchUsers();
          handleAddNewUserModalClose();
        } catch (error) {
          toast.error(
            error?.data?.message || "An error occurred during register."
          );
        }
      },
    });

  return (
      <div className="w-full">
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 relative">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="firstName"
                value={values.firstName}
                type="text"
                placeholder="First Name"
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
                value={values.lastName}
                type="text"
                placeholder="Last Name"
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
                placeholder="Email ID"
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
                name="password"
                value={values.password}
                type="password"
                placeholder="Password"
                className="border-b-2 bg-transparent w-full pl-5 pb-3 outline-none"
              />
              <div className="absolute top-1 left-0 text-gray-400">
                <IoLockClosedOutline />
              </div>
              {errors.password && touched.password && (
                <small className="text-red-500">{errors.password}</small>
              )}
            </div>
            <div className="mb-3 relative">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="cPassword"
                value={values.cPassword}
                type={showPassword ? "text" : "password"}
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
              {errors.cPassword && touched.cPassword && (
                <small className="text-red-500">{errors.cPassword}</small>
              )}
            </div>
            <div className="py-5 text-center">
                <div>
                {isLoading && <Loader />}    
                </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-300"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default AddNewUser;
