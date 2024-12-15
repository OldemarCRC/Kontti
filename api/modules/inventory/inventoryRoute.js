import express from "express";
import {
  getInventory,
  updateLocation,
  getContainers,

} from "./inventoryController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";


const router = express.Router();

router.get('/containers', verifyToken, getContainers);

router.get('/', verifyToken, getInventory);

router.patch('/location', verifyToken, updateLocation);

export default router;