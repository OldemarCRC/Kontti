import express from "express";
import {
  createMovement,
  deleteMovement,
  getMovement,
  getMovements,
  updateMovement,
} from "./movementController.js";
import { verifyToken, verifyUser} from "../../middlewares/verifyToken.js";


const router = express.Router();

router.post("/", verifyToken, createMovement);

router.put("/:id", verifyToken, updateMovement);

router.delete("/:id", verifyToken, deleteMovement);

router.get("/:id", verifyToken, getMovement);

router.get("/", verifyToken, getMovements);

export default router;

