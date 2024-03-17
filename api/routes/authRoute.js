import express from "express";
import { login, register, verifyEmail, changePassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/verify-email", verifyEmail);
router.put("/change-password", changePassword);

export default router