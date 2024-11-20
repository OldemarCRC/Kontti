import express from "express";
import { customerRegister, customersList } from "../controllers/customersController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/customer-register", verifyToken, customerRegister)
router.get("/", verifyToken, customersList);

export default router