import express from "express";
import { 
    addNewUser, 
    blockUnblockUser, 
    deleteAdminProfileImage, 
    deleteUser, 
    getAdminProfile, 
    getUsers, 
    loginAdmin, 
    logoutAdmin, 
    uploadAdminProfileImage, 
    updateUser
} from "../controllers/adminController.js";
import { authorizeRole } from "../middlewares/authorizeRole.js";
import { protectAdmin } from "../middlewares/adminAuthMiddleware.js";
import { upload } from "../middlewares/fileUploadMiddleware.js";


const adminRouter = express.Router();

adminRouter.post("/logout", logoutAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/create-user", protectAdmin, authorizeRole("admin"), addNewUser)
adminRouter.route("/profile").post(upload.single('profileImage'), protectAdmin, uploadAdminProfileImage)
.delete(protectAdmin, deleteAdminProfileImage);
// .get(protectAdmin, authorizeRole("admin"), getAdminProfile)
adminRouter.get("/users", protectAdmin, authorizeRole("admin"), getUsers);
adminRouter.put("/users/update-user/:id", protectAdmin, authorizeRole('admin'), updateUser);
adminRouter.delete("/users/:id", protectAdmin, authorizeRole('admin'), deleteUser);
adminRouter.patch("/users/block-unblock/:id", protectAdmin, authorizeRole('admin'), blockUnblockUser);


export default adminRouter;
