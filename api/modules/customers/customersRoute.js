import express from "express";
import { customerRegister, customersList } from "./customersController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/customer-register", verifyToken, customerRegister)
router.get("/", verifyToken, customersList);

export default router