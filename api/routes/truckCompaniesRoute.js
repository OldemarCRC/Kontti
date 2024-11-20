import express from "express";
import { truckCompanyRegister, truckCompaniesList } from "../controllers/truckCompaniesController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/truck-company-register", verifyToken, truckCompanyRegister)
router.get("/", verifyToken, truckCompaniesList);

export default router