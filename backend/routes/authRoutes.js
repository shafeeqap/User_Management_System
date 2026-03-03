import express from "express";

import {
  googleAuth,
  googleAuthCallback,
  loginSuccess,
  loginFailed,
  logout,
} from "../controllers/authController.js";


const authRoutes = express.Router();

authRoutes.get("/login/success", loginSuccess);
authRoutes.get("/login/failed", loginFailed);
authRoutes.get("/google", googleAuth);
authRoutes.get("/google/callback", googleAuthCallback);
authRoutes.get("/logout", logout);

export default authRoutes;
