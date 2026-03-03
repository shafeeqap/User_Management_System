import asyncHandler from "express-async-handler";
import User from "../models/users.js";
import generateToken from "../utils/generateToken.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { sendEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc     Auth User/set token
// route     POST /api/users/auth
// @access   Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  
  if(!user){
    return res.status(400).json({ message: "User not exist!"});
  }

  if(user.isStatus === false){
    return res.status(400).json({ message: "User is blocked"});
  }  

  if (user && (await user.matchPasswords(password))) {

    generateToken(res, user._id, user.role);

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      profileImage: user.profileImage,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// @desc     Register a new user
// route     POST /api/users/
// @access   Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("User already exist");
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: 'user',
  });
  if (user) {
    // generateToken(res, user._id, user.role);
    return res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc     Logout user
// route     POST /api/users/logout
// @access   Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out" });
});

// @desc     Get user profile
// route     GET /api/users/profile
// @access   Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    mobile: req.user.mobile,
    profileImage: req.user.profileImage,
  };
  res.status(200).json({ message: "User profile", user });
});

// @desc     Update user profile
// route     PUT /api/users/profile
// @access   Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;
    user.profileImage = req.body.profileImage || user.profileImage;

    if (req.body.password) {
      user.password = req.body.password;
    }
    
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc     Update user password
// route     PUT /api/users/updatePassword
// @access   Private
const updatePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const isMatch = await user.matchPasswords(req.body.currentPassword);

  if (!isMatch) {
    res.status(400).json({ message: "Current password is incorrect" });
  }
  user.password = req.body.newPassword;
  await user.save();
  return res.status(200).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    profileImage: user.profileImage,
  });
});

// @desc     Upload profile image
// route     POST /api/users/profileImage
// @access   Private
const uploadProfileImage = asyncHandler(async (req, res) => {
  
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.profileImage = `${req.file.filename}`;
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    mobile: updatedUser.mobile,
    profileImage: updatedUser.profileImage,
    message: "Profile image added successfully",
  });
});

// @desc     Delete profile image
// route     DELETE /api/users/profileImage
// @access   Private
const deleteProfileImage = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const imagePath = path.join(__dirname, "../public/userProfile", user.profileImage);

  // Remove the image file from the server
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  user.profileImage = "";
  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
    mobile: updatedUser.mobile,
    profileImage: updatedUser.profileImage,
    message: "Profile image deleted successfully",
  });
});

// @desc     Forgot Password
// route     POST /api/users/forgotPassword
// @access   Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Generate OTP (6-digit number)
  const { otp, otpExpire } = await generateOTP(user);

  const message = `<p>Your OTP for password reset is: 
  <strong style="font-size: 20px">${otp}</strong>. 
  This OTP is valid for 5 minutes.</p>`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP",
      html: message,
    });
    res.status(200).json({ message: "OTP sent to your email", otpExpire });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP email" });
  }
});

// @desc     Verify OTP
// route     POST /api/users/verifyOTP
// @access   Public
const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.otp = undefined;
  user.otpExpire = undefined;
  const updated = await user.save();

  res.status(200).json({ message: "verified" });
});

// @desc     Re-send OTP
// route     POST /api/users/resendOtp
// @access   Public
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const { otp, otpExpire} = await generateOTP(user);

  const message = `<p>Your new OTP for password reset is: 
  <strong style="font-size: 20px">${otp}</strong>. 
  This OTP is valid for 5 minutes.</p>`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Resend Password Reset OTP",
      html: message,
    });
    res.status(200).json({ message: "OTP resent to your email", otpExpire });
  } catch (error) {
    res.status(500).json({ message: "Failed to resend OTP email" });
  }
});

// @desc     Reset Password
// route     POST /api/users/resetPassword
// @access   Public
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  user.password = newPassword;
  const updated = await user.save();

  res.status(200).json({ message: "Password reset successful" });
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updatePassword,
  uploadProfileImage,
  deleteProfileImage,
  forgotPassword,
  verifyOTP,
  resendOtp,
  resetPassword,
};
