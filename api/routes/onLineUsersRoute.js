import express from "express";
import { onLineUsers, logoutUser  } from "../controllers/onLineUsersController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/online-users", verifyToken, onLineUsers);
router.post("/logout", logoutUser);//considerar agregar verifyToken y enviarlo desde frontend

export default router