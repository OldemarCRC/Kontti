import express from "express";
import { createDispatchOrder,getDispatchOrders, updateDispatchOrderStatus, getDispatchOrdersByCustomer } from "./dispatchOrderController.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import roleAccessControl from "../../middlewares/roleAccessControl.js"

const router = express.Router();

router.post("/", verifyToken, roleAccessControl, createDispatchOrder);

router.get('/dispatchOrders', verifyToken, getDispatchOrders);

router.patch('/updateStatus', verifyToken, roleAccessControl, updateDispatchOrderStatus);

router.get('/customer/:customer',verifyToken,  getDispatchOrdersByCustomer);

export default router;