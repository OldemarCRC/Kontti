import express from "express";
import { truckCompanyRegister, truckCompaniesList } from "./truckCompaniesController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import roleAccessControl from "../../middlewares/roleAccessControl.js"

const router = express.Router();

router.post("/truck-company-register", verifyToken, roleAccessControl, truckCompanyRegister)
router.get("/", verifyToken, truckCompaniesList);

export default router