import express from "express";
import { customsManifestRegister, customsManifestList } from "../controllers/customsManifestController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/manifest-register", verifyToken, customsManifestRegister)
router.get("/", verifyToken, customsManifestList);

export default router