import { useState, useEffect } from "react";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { signupValidation } from "../../../utils/validation/userSignupValidation.js";
import { IoLockClosedOutline } from "react-icons/io5";
import { TfiEmail } from "react-icons/tfi";
import { FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRegisterMutation } from "../../../features/user/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
// import { setCredentials } from "../../../features/auth/authSlice.js";
import Loader from "../../../Components/Loader/Loader";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  cPassword: "",
};

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const { values, handleChange, handleSubmit, handleBlur, errors, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: signupValidation,
      onSubmit: async (values) => {
        try {
          const res = await toast.promise(register(values).unwrap(), {
            pending: "Registering...",
            success: "Registration successful!",
            error: "Registeration failed!",
          });
          console.log(res, 'response');
          // dispatch(setCredentials({ ...res }));
          navigate("/login");
        } catch (error) {
          toast.error(
            error?.data?.message || "An error occurred during register."
          );
        }
      },
    });

  return (
    <div className="flex justify-center items-center py-5 min-h-screen bg-black/65 text-white">
      <div className="bg-black/10 w-1/4 rounded-3xl">
        <div className="bg-black/20 text-center p-5 rounded-t-3xl">
          <h2 className="uppercase">user signup</h2>
        </div>
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
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black/20 uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-black/30 hover:text-gray-300"
              >
                {isLoading ? <Loader /> : "signup"}
              </button>
            </div>
            <div className="text-center text-sm pb-5">
              <p>
                You have already an account?{" "}
                <Link to="/login">
                  <span className="text-gray-400 hover:underline">Log in</span>
                </Link>
              </p>
            </div>
          </form>
          <div className="text-center mb-5">
            <div className="flex justify-between items-center w-full">
              <div className="border-t border-gray-300 w-1/2"></div>
              <p className="px-3 text-gray-50">Or</p>
              <div className="border-t border-gray-300 w-1/2"></div>
            </div>
            <div className="mt-3 border border-gray-300 rounded-md bg-white">
              <div className="flex justify-between items-center px-5 p-1 cursor-pointer">
                <FcGoogle />
                <div className="w-full">
                <p className="text-black">Sign up with Google</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
