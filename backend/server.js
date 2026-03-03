import express from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import passport from "passport";
import session from "express-session";
import './config/passport.js'

dotenv.config();
connectDB();
const PORT = process.env.PORT || 8080;

const app = express();


app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false, 
    cookie: { secure: false, httpOnly: true }, 
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  methods:"GET,POST,PUT,DELETE,PATCH", 
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/userProfile", express.static(path.join(__dirname, "public/userProfile")));
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running:http://localhost:${PORT}`);
});
