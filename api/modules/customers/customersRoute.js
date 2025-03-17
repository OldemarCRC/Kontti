import express from "express";
import { customerRegister, customersList } from "./customersController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import roleAccessControl from "../../middlewares/roleAccessControl.js"

const router = express.Router();

router.post("/customer-register", verifyToken, roleAccessControl, customerRegister)
router.get("/", verifyToken, customersList);

export default router