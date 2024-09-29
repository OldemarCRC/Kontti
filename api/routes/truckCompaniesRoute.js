import express from "express";
import { truckCompanyRegister, truckCompaniesList } from "../controllers/truckCompaniesController.js";

const router = express.Router();

router.post("/truck-company-register", truckCompanyRegister)
router.get("/", truckCompaniesList);

export default router