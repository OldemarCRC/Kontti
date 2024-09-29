import express from "express";
import { customsManifestRegister, customsManifestList } from "../controllers/customsManifestController.js";

const router = express.Router();

router.post("/manifest-register", customsManifestRegister)
router.get("/", customsManifestList);

export default router