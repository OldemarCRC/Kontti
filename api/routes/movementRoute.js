import express from "express";
import {
  createMovement,
  deleteMovement,
  getMovement,
  getMovements,
  updateMovement,
} from "../controllers/movementController.js";
import { verifyUser} from "../utils/verifyToken.js";

const router = express.Router();

//CREATE Movement
router.post("/", createMovement);

//UPDATE Movement
router.put("/:id", verifyUser, updateMovement);

//DELETE Movement
router.delete("/:id", verifyUser, deleteMovement);

//GET a single Movement
router.get("/:id", getMovement);

//GET ALL Movements
router.get("/", getMovements);

export default router;

