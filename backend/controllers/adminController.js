import asyncHandler from "express-async-handler";
import User from "../models/users.js";
import generateToken from "../utils/generateToken.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// @desc     Auth Admin/set token
// route     POST /api/admin/login
// @access   Public
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User not exist!" });
  }

  if (user && (await user.matchPasswords(password))) {
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as an admin" });
    }
    generateToken(res, user._id, user.role);
    
  res.status(201).json({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    googleId: user.googleId,
    profileImage: user.profileImage,
    role: user.role,
  });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});


// @desc     Logout admin
// route     POST /api/admin/logout
// @access   Public
const logoutAdmin = asyncHandler(async (req, res) => {
  
  res.cookie("jwt", "", {
    expires: new Date(0),
  });
  res.status(200).json({ message: "Admin logged out" });
});

// @desc     Add a new user
// route     POST /api/admin/add-user
// @access   Public
const addNewUser = asyncHandler(async (req, res) => {
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
    // generateToken(res, user._id);
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


// @desc     Users Data
// route     GET /api/admin/users
// @access   Private
const getUsers = asyncHandler(async (req, res) => {
  
  const user = await User.find({});

  res.status(200).json({ message: "User Data", user });
});

// @desc     Update user
// route     PUT /api/admin/users/update-user/:id
// @access   Private
const updateUser = asyncHandler(async(req, res) =>{
  const userId = req.params.id;

  const { firstName, lastName, email, mobile } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.email = email || user.email;
  user.mobile = mobile || user.mobile;

  const updatedUser = await user.save();

  res.status(200).json({ message: "User updated successfully", updatedUser})

});


// @desc     Delete user
// route     DELETE /api/admin/users/:id
// @access   Private
const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndDelete(userId);

  if (user) {
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// @desc     Block and Unblock user
// route     PATCH /api/admin/users/block-unblock
// @access   Private
const blockUnblockUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId });

  if (user) {
    user.isStatus = !user.isStatus;
    await user.save();

    res.status(200).json({
      message: user.isStatus ? "User is unblocked" : "User is blocked",
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});


// @desc     Get admin profile image
// route     GET /api/admin/profile
// @access   Private
const getAdminProfile = asyncHandler(async(req, res) => {});

// @desc     Upload admin profile image
// route     POST /api/admin/profile
// @access   Private
const uploadAdminProfileImage = asyncHandler(async(req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Admin not authenticated" });
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "Admin not found" });
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
    role: updatedUser.role,
    message: "Admin profile image added successfully",
  });
  
  
});

// @desc     Delete admin profile image
// route     DELETE /api/admin/profile
// @access   Private
const deleteAdminProfileImage = asyncHandler(async(req, res) => {
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
    role: updatedUser.role,
    message: "Profile image deleted successfully",
  });
  
});



export { 
  loginAdmin, 
  logoutAdmin, 
  getAdminProfile, 
  uploadAdminProfileImage, 
  deleteAdminProfileImage,
  addNewUser, 
  getUsers, 
  updateUser, 
  deleteUser, 
  blockUnblockUser 
};
