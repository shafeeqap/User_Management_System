import { TfiEmail } from "react-icons/tfi";
import { useFormik } from "formik";
import { forgotPasswordValidation } from "../../utils/validation/forgotPasswordValidation";
import { useForgotPasswordMutation } from "../../features/user/usersApiSlice";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import { useState } from "react";
import VerifyOTP from "../verifyOTP/verifyOTP";

const initialValues = {
  email: "",
};

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otpExpire, setOtpExpire] = useState();

  const { values, handleChange, handleBlur, handleSubmit, errors, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: forgotPasswordValidation,
      onSubmit: async (values) => {
        try {
          const res = await forgotPassword(values).unwrap();
          console.log(res, "forgotpassword response");
          toast.success(res.message);

          if (res.otpExpire) {
            setOtpExpire(res.otpExpire);
          }

          setEmail(values.email);
          setOtpSent(true);
        } catch (error) {
          console.log(error?.data?.message || error.error);
          toast.error(error?.data?.message);
        }
      },
    });

  return (
    <div>
      {!otpSent ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3 relative">
            <input
              onChange={handleChange}
              onBlur={handleBlur}
              name="email"
              type="email"
              value={values.email}
              placeholder="Enter your email"
              className="border-b-2 text-black  w-full pl-5 pb-3 outline-none"
            />
            <div className="absolute top-1 left-0 text-gray-400">
              <TfiEmail />
            </div>
            {errors.email && touched.email && (
              <small className="text-red-500">{errors.email}</small>
            )}
          </div>
          <div className="py-5 text-center">
            <div className="flex justify-center">{isLoading && <Loader />}</div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-200"
            >
              verify email
            </button>
          </div>
        </form>
      ) : (
        <VerifyOTP email={email} otpExpire={otpExpire} />
      )}
    </div>
  );
};

export default ForgotPassword;
