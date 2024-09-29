import express from "express";
import { createOrder,getReleaseOrders, updateReleaseOrderStatus, getReleaseOrdersByCustomer } from "../controllers/releaseOrderController.js";

const router = express.Router();

router.post("/", createOrder);
// Ruta para obtener las órdenes de salida de la colección releaseOrders
router.get('/releaseOrders', getReleaseOrders);

//Ruta para modificar el status de la orden de salida
router.patch('/updateStatus', updateReleaseOrderStatus);

router.get('/customer/:customer', getReleaseOrdersByCustomer);

export default router;