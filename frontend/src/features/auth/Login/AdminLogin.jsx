import { useEffect, useState } from "react";
import { PiEyeThin, PiEyeSlashThin } from "react-icons/pi";
import { useFormik } from "formik";
import { adminLoginValidation } from "../../../utils/validation/adminLoginValidation";
import { toast } from "react-toastify";
import Loader from "../../../Components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAdminLoginMutation } from "../../admin/adminApiSlice";
import { setAdminCredentials } from "../../../features/admin/adminSlice";

const initialValues = {
  email: "",
  password: "",
};

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [adminLogin, { isLoading }] = useAdminLoginMutation();
  const { adminInfo } = useSelector((state) => state.admin);

  useEffect(() => {
    if (adminInfo) {
      navigate("/admin");
    }
  }, [adminInfo, navigate]);

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: adminLoginValidation,
      onSubmit: async (values) => {
        try {
          const res = await toast.promise(adminLogin(values).unwrap(), {
            pending: "Logging in...",
            success: "Logged in successfully!",
            error: "Login failed!",
          }); console.log(res, 'response');
          
          dispatch(setAdminCredentials({ ...res }));
          navigate("/admin");
        } catch (error) {
          console.log(error?.data?.message || error.error);
          toast.error(
            error?.data?.message || "An error occurred during login."
          );
        }
      },
    });


  return (
    <div className="flex justify-center items-center h-screen bg-black/65">
      <div className="flex flex-col bg-gray-400 p-4 w-1/4">
        <div className="text-center m-5">
          <h2 className="font-semibold uppercase">Admin Login</h2>
        </div>
        <div className="">
          <form onSubmit={handleSubmit}>
            <div className="mb-5 flex flex-col">
              <input
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Email"
                className="p-1 outline-none"
              />
              {errors.email && touched.email && (
                <small className="text-red-500">{errors.email}</small>
              )}
            </div>
            <div className="flex flex-col mb-5 relative">
              <input
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-1 outline-none"
              />
              <div className="absolute top-2 right-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <PiEyeSlashThin /> : <PiEyeThin />}
                </button>
              </div>
              {errors.password && touched.password && (
                <small className="text-red-500">{errors.password}</small>
              )}
              <div className="text-end">
                <p className="text-sm text-gray-600 cursor-pointer">
                  Forgot password?
                </p>
              </div>
            </div>
            <div className="flex justify-center">{isLoading && <Loader />}</div>
            <div className="mb-1">
              <button className="bg-blue-500 uppercase p-1 w-full text-white">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
