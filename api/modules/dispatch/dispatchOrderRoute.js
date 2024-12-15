import express from "express";
import { createDispatchOrder,getDispatchOrders, updateDispatchOrderStatus, getDispatchOrdersByCustomer } from "./dispatchOrderController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createDispatchOrder);

router.get('/dispatchOrders', verifyToken, getDispatchOrders);

router.patch('/updateStatus', verifyToken, updateDispatchOrderStatus);

router.get('/customer/:customer',verifyToken,  getDispatchOrdersByCustomer);

export default router;