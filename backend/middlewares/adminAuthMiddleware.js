import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/users.js';

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt_admin;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: not an admin' });
      }

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(401).json({ message: 'Not authorized, invalid token'});
    }
  } else {
    console.error('Token not provided');
    return res.status(401).json({ message: 'Not authorized: No token provided' });
  }
});

export { protectAdmin };
