import express from "express";
import { manifestRegister, manifestList } from "../controllers/manifestController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/manifest-register", verifyToken, manifestRegister)
router.get("/", verifyToken, manifestList);

export default router