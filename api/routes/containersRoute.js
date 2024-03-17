import express from "express";

import {
  getInventory,
  createContainer,
  deleteContainer,
  getContainer,
  getContainers,
  updateContainer,
} from "../controllers/containerController.js";
import {verifyAdmin} from "../utils/verifyToken.js"

const router = express.Router();

//CREATE
router.post("/",  createContainer);

//UPDATE
router.put("/:id",verifyAdmin,  updateContainer);
//DELETE
router.delete("/:id",verifyAdmin,   deleteContainer);
//GET

router.get("/find/:id", getContainer);
//GET ALL

router.get('/inventory', getInventory);

//
//router.get("/countByType", countByType);

export default router;
