import express from "express";
import {
  createMovement,
  deleteMovement,
  getMovement,
  getMovements,
  updateMovement,
} from "../controllers/movementController.js";
import { verifyToken, verifyUser} from "../utils/verifyToken.js";


const router = express.Router();

//CREATE Movement
router.post("/", verifyToken, createMovement);

//UPDATE Movement
router.put("/:id", verifyToken, updateMovement);

//DELETE Movement
router.delete("/:id", verifyToken, deleteMovement);

//GET a single Movement
router.get("/:id", verifyToken, getMovement);

//GET ALL Movements
router.get("/", verifyToken, getMovements);

export default router;

