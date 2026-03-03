import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/users.js";
import { json } from "express";

const protectUser = asyncHandler(async (req, res, next) => {
  
    let token = req.cookies.jwt_user;

    if (token) {
      try {
        const decodded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodded.userId).select("-password");

        if (!req.user) {
          return res.status(404).json({ message: 'User not found' });
        }

        if(req.user.role !== 'user'){
          return res.status(403).json({ message: 'Access denied; not a user'});
        }

        if(req.user.isStatus === false){
          return res.status(403).json({ message: 'User is blocked' });
        }

        next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          res.status(401).json({ message: "Token expired" });
        } else {
          res.status(401).json({ message: "Not authorized, invalid token" });
        }
      }
    } else {
      console.error("Token not provided");
      res.status(401).json({ message: "Not authorized, no token" });
    }
  });

export { protectUser };
