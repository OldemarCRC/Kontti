import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "./userController.js";
import { verifyAdmin, verifyToken, verifyUser } from "../../middlewares/verifyToken.js";
import roleAccessControl from "../../middlewares/roleAccessControl.js"

const router = express.Router();


router.put("/:id", verifyToken, verifyUser, roleAccessControl, updateUser);

router.delete("/:id", verifyToken, verifyUser, roleAccessControl, deleteUser);

router.get("/:id", verifyToken, verifyUser, roleAccessControl, getUser);

router.get("/", verifyToken, verifyAdmin, roleAccessControl, getUsers);

export default router;



