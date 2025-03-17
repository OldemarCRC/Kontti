import express from "express";
import {
  createMovement,
  deleteMovement,
  getMovement,
  getMovements,
  updateMovement,
} from "./movementController.js";
import { verifyToken, verifyUser} from "../../middlewares/verifyToken.js";
import roleAccessControl from "../../middlewares/roleAccessControl.js"


const router = express.Router();

router.post("/", verifyToken, roleAccessControl, createMovement);

router.put("/:id", verifyToken, roleAccessControl, updateMovement);

router.delete("/:id", verifyToken, roleAccessControl, deleteMovement);

router.get("/:id", verifyToken, getMovement);

router.get("/", verifyToken, getMovements);

export default router;

