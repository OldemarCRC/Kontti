import express from "express";
import { manifestRegister, manifestList } from "./manifestController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/manifest-register", verifyToken, manifestRegister)
router.get("/", verifyToken, manifestList);

export default router