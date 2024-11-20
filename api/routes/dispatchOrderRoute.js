import express from "express";
import { createDispatchOrder,getDispatchOrders, updateDispatchOrderStatus, getDispatchOrdersByCustomer } from "../controllers/dispatchOrderController.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createDispatchOrder);
// Ruta para obtener las órdenes de salida de la colección releaseOrders
router.get('/dispatchOrders', verifyToken, getDispatchOrders);

//Ruta para modificar el status de la orden de salida
router.patch('/updateStatus', verifyToken, updateDispatchOrderStatus);

router.get('/customer/:customer',verifyToken,  getDispatchOrdersByCustomer);

export default router;