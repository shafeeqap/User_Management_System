import passport from "passport";
import generateToken from "../utils/generateToken.js";

const loginSuccess = (req, res) => {
  if (req.user) {    
    generateToken(res, req.user._id);
    res.status(200).json({
      error: false,
      message: "Successfuylly Loged in",
      _id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      googleId: req.user.googleId,
      profileImage: req.user.profileImage,
      displayName: req.user.displayName,
    });
  } else {
    // res.status(401).json({ error: true, message: "No user is logged in" });
  }
};

const loginFailed = (req, res) => {
  res.status(401).json({
    error: true,
    message: "User authentication failed",
  });
};

// Start Google OAuth 2.0 flow
const googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })(req, res, next);
};

// Google OAuth 2.0 callback
const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      console.log("Error during authentication:", err);
      return next(err);
    } 
    if (!user) {
      console.log("No user found during authentication.");
      return res.redirect("/auth/login/failed"); 
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return next(err);
      }

      // Generate JWT and set cookie
      generateToken(res, user._id);

      // Redirect to the frontend after successful login
      res.redirect(`${process.env.FRONTEND_URL}`);
    });
  })(req, res, next);
};



const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: true, message: "Failed to logout" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.log("Failed to destroy session:", err);
      } else {
        console.log("Session destroyed successfully");
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.redirect(process.env.FRONTEND_URL);
    });
  });
};

export { googleAuth, googleAuthCallback, loginSuccess, loginFailed, logout };
