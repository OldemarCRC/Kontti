import express from "express";
import { loginLimiter, loginSecurityMiddleware, login, register, verifyEmail, changePassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", loginLimiter, loginSecurityMiddleware, login)
router.get("/verify-email", verifyEmail);
router.put("/change-password", changePassword);

export default router