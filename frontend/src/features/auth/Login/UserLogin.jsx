import { useEffect, useState } from "react";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { IoLockClosedOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { loginValidation } from "../../../utils/validation/userLoginValidation.js";
import { TfiEmail } from "react-icons/tfi";
import { useLoginMutation } from "../../user/usersApiSlice.js";
import { useGoogleLoginMutation } from "../../user/authApiSlice.js";
import {
  openForgotPasswordModal,
  closeForgotPasswordModal,
} from "../../modal/modalSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../authSlice.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../../../Components/Loader/Loader.jsx";
import Modal from "../../../Components/modal/Modal.jsx";
import ForgotPassword from "../../../Components/forgotPassword/ForgotPassword.jsx";
import CryptoJs from "crypto-js";
import { handleRememberMe, saveCredentials } from "../../../utils/helpers/rememberMe.js";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { isForgotPasswordModalOpen } = useSelector((state) => state.modal);
  const [googleLogin] = useGoogleLoginMutation();


  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      const decryptedPassword = CryptoJs.AES.decrypt(savedPassword, "secret-key").toString(CryptoJs.enc.Utf8);
      initialValues.email = savedEmail;
      initialValues.password = decryptedPassword;
      setRememberMe(true);
    }
  }, []);


  useEffect(() => {
    if (userInfo) {
      navigate("/")
    }else{
      getUser();
    }
  }, [userInfo]);
  

  const handleGoogleLogin = () =>{
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const getUser = async () =>{
    try {
      const res = await googleLogin().unwrap();
      console.log(res, 'res');
      toast.success(res.message);

      dispatch(setCredentials({ ...res }));
      navigate("/");
      
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
      
    }
  };



  const handleCheckboxChange = (e, setFieldValue) => {
    const isChecked = e.target.checked;
    setRememberMe(isChecked);

    handleRememberMe(isChecked, setFieldValue);
  };



  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginValidation,
    onSubmit: async (values) => {
      try {
        const res = await toast.promise(login(values).unwrap(), {
          pending: "Logging in...",
          success: "Logged in successfully!",
          error: "Login failed!",
        });
        saveCredentials(rememberMe, values);
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (error) {
        console.log(error?.data?.message || error.error ,'error');
        toast.error(error?.data?.message || "An error occurred during login.");
      }
    },
  });

  const handleForgotPasswordOpen = () => {
    dispatch(openForgotPasswordModal());
  };

  const handlForgotPasswordClose = () => {
    dispatch(closeForgotPasswordModal());
  };

  return (
    <div className="flex justify-center items-center h-screen bg-black/65 text-white">
      <div className="bg-black/10 w-1/4 rounded-3xl">
        <div className="bg-black/20 text-center p-5 rounded-t-3xl">
          <h2 className="uppercase">user login</h2>
        </div>
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-5 relative">
              <input
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                type="email"
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
                type={showPassword ? "text" : "password"}
                name="password"
                value={values.password}
                placeholder="Password"
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
              <div className="flex flex-row-reverse justify-between">
                <small
                  onClick={handleForgotPasswordOpen}
                  className="cursor-pointer texbl hover:text-gray-300"
                >
                  Forgot password?
                </small>
                <div className="flex gap-1 max-sm:hidden">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => handleCheckboxChange(e, setFieldValue)}
                    id="rememberMe"
                  />
                  <label className="text-sm" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
              </div>
              {errors.password && touched.password && (
                <small className="text-red-500">{errors.password}</small>
              )}
            </div>
            <div className="py-5 text-center">
              <div className="flex justify-center">{isLoading && (<Loader />)}</div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-black/20 uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-black/30 hover:text-gray-300"
              >
                Login
              </button>
            </div>
            <div className="text-center text-sm">
              <p>
                You don’t have an account?{" "}
                <Link to="/signup">
                  <span className="text-gray-400 hover:underline">Sign up</span>
                </Link>
              </p>
            </div>
          </form>
          <div className="text-center py-5">
            <div className="flex justify-between items-center w-full">
              <div className="border-t border-gray-300 w-1/2"></div>
              <p className="px-3 text-gray-50">OR</p>
              <div className="border-t border-gray-300 w-1/2"></div>
            </div>
            <div className="mt-3 border border-gray-300 rounded-md bg-white">
              <div className="flex justify-between items-center px-5 p-1 cursor-pointer">
                <FcGoogle />
                <div className="w-full">
                  <button onClick={handleGoogleLogin} className="text-black">Log in with Google</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={handlForgotPasswordClose}
        title={"Forgot Password"}
      >
        <ForgotPassword />
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default Login;
