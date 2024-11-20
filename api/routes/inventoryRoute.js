import express from "express";
import {
  getInventory,
  updateLocation,
  getContainers,

} from "../controllers/inventoryController.js";
/* import { verifyUser} from "../utils/verifyToken.js"; */
import { verifyToken } from "../utils/verifyToken.js";


const router = express.Router();

// Ruta para obtener los contenedores del inventario
router.get('/containers', verifyToken, getContainers);

// Ruta para obtener el inventario
router.get('/', verifyToken, getInventory);

//Ruta para modificar posición del contenedor en la terminal
router.patch('/location', verifyToken, updateLocation);

export default router;