import express from "express";
import { isMongoConnected, loginLimiter, loginSecurityMiddleware, login, register, verifyEmail, changePassword } from "./authController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import roleAccessControl from "../../middlewares/roleAccessControl.js"

const router = express.Router();

router.post("/register", verifyToken, roleAccessControl, register)
router.post("/login", isMongoConnected, loginLimiter, loginSecurityMiddleware, login)
router.get("/verify-email", verifyEmail);
router.put("/change-password", verifyToken, roleAccessControl, changePassword);

export default router