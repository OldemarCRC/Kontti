import express from "express";
import { customerRegister, customersList } from "../controllers/customersController.js";

const router = express.Router();

router.post("/customer-register", customerRegister)
router.get("/", customersList);

export default router
