import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "./userController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../../middlewares/verifyToken.js";

const router = express.Router();


router.put("/:id", verifyToken, verifyUser, updateUser);

router.delete("/:id", verifyToken, verifyUser, deleteUser);

router.get("/:id", verifyToken, verifyUser, getUser);

router.get("/", verifyToken, verifyAdmin, getUsers);

export default router;



