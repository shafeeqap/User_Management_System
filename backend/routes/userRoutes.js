import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  uploadProfileImage,
  deleteProfileImage,
  forgotPassword,
  resetPassword,
  resendOtp,
  verifyOTP,
} from "../controllers/userController.js";
import { protectUser } from "../middlewares/userAuthMiddleware.js";
import { upload } from "../middlewares/fileUploadMiddleware.js";


const userRouter = express.Router();

userRouter.post("/", registerUser);
userRouter.post("/auth", authUser);
userRouter.post("/logout", logoutUser);
userRouter.route("/profile").get(protectUser, getUserProfile).put(protectUser, updateUserProfile);
userRouter.put("/updatePassword", protectUser, updatePassword);
userRouter.post("/profileImage", upload.single('profileImage'), protectUser, uploadProfileImage);
userRouter.delete("/profileImage", protectUser, deleteProfileImage);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.post("/verifyOTP", verifyOTP);
userRouter.post("/resetPassword", resetPassword);
userRouter.post("/resendOtp", resendOtp);

export default userRouter;
