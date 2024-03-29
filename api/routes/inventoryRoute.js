import express from "express";
import {
  getInventory,
  updateLocation,
  getContainers,

} from "../controllers/inventoryController.js";
/* import { verifyUser} from "../utils/verifyToken.js"; */

const router = express.Router();

// Ruta para obtener los contenedores del inventario
router.get('/containers', getContainers);

// Ruta para obtener el inventario
router.get('/', getInventory);

//Ruta para modificar posición del contenedor en la terminal
router.patch('/location', updateLocation);

export default router;