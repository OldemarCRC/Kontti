import express from "express";

import {
  createProvisionalMovement,
  deleteProvisionalMovement,
  getProvisionalMovement,
  updateProvisionalMovement,
} from "../controllers/provisionalMovementController.js";
import {verifyAdmin} from "../utils/verifyToken.js"

const router = express.Router();

//CREATE
router.post("/",  createProvisionalMovement);

//UPDATE
router.put("/:id",verifyAdmin,  updateProvisionalMovement);
//DELETE
router.delete("/:id",verifyAdmin,   deleteProvisionalMovement);
//GET

router.get("/find/:id", getProvisionalMovement);

export default router;
