import { useEffect, useState } from "react";
import {
  useVerifyOTPMutation,
  useResendOtpMutation,
} from "../../features/user/usersApiSlice";
import Loader from "../Loader/Loader";
import ResetPassword from "../ForgotPassword/ResetPassword";
import { toast } from "react-toastify";

const VerifyOTP = ({ email, otpExpire }) => {
  const [OTP, setOTP] = useState("");
  const [step, setStep] = useState("verifyOTP");
  const [timer, setTimer] = useState(
    Math.floor((otpExpire - Date.now()) / 1000)
  );
  const [VerifyOTP, { isLoading: isVerifying }] = useVerifyOTPMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await VerifyOTP({ email, otp: OTP }).unwrap();
      console.log(res, "verify otp response");
      toast.success(res.message);

      if (res.message === "verified") {
        setStep("resetPassword");
        setOTP("");
      } else {
        setTimer(0);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  const handleResendOTP = async () => {
    try {
      const res = await resendOtp({ email, otp: OTP }).unwrap();
      console.log(res, "resent opt");
      toast.success(res.message);

      if (res.otpExpire) {
        setTimer(Math.floor((res.otpExpire - Date.now()) / 1000));
        setOTP("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      {step === "verifyOTP" ? (
        <form onSubmit={handleSubmitOTP}>
          <div className="flex flex-col justify-center items-center">
            <div className="">
              <p className="text-black">Enter your OTP</p>
            </div>
            <div className="m-5">
              <input
                value={OTP}
                onChange={(e) => setOTP(e.target.value)}
                type="text"
                autoFocus
                disabled={false}
                className="w-32 rounded-md p-1 border border-gray-400 text-black text-center text-2xl"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center">
              {isVerifying && <Loader />}
            </div>
            {timer === 0 && (
              <div className="py-2">
                <button
                  onClick={handleResendOTP}
                  type="button"
                  className=" text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full text-blue-500"
                >
                  Resent OTP
                </button>
              </div>
            )}
            <div className="flex justify-center">
              {isResending && <Loader />}
            </div>
            <button
              type="submit"
              className="mb-5 bg-blue-500 uppercase p-2 text-sm max-w-sm rounded-md sm:text-base sm:p-3 md:p-2 lg:w-full hover:bg-blue-600 hover:text-gray-200"
            >
              Verify OTP
            </button>

            {timer > 0 && (
              <div className="text-center text-black">
                Resend OTP in <span className="text-red-500">{timer}</span>{" "}
                seconds
              </div>
            )}
          </div>
        </form>
      ) : (
        <ResetPassword email={email} />
      )}
    </div>
  );
};

export default VerifyOTP;
