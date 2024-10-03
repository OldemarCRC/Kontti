import express from "express";
import { createDispatchOrder,getDispatchOrders, updateDispatchOrderStatus, getDispatchOrdersByCustomer } from "../controllers/dispatchOrderController.js";

const router = express.Router();

router.post("/", createDispatchOrder);
// Ruta para obtener las órdenes de salida de la colección releaseOrders
router.get('/dispatchOrders', getDispatchOrders);

//Ruta para modificar el status de la orden de salida
router.patch('/updateStatus', updateDispatchOrderStatus);

router.get('/customer/:customer', getDispatchOrdersByCustomer);

export default router;