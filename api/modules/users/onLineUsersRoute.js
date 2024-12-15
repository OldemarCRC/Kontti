import express from "express";
import { onLineUsers, logoutUser  } from "./onLineUsersController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.get("/online-users", verifyToken, onLineUsers);
router.post("/logout", verifyToken, logoutUser);

export default router