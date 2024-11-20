import Inventory from "../models/inventoryModel.js";

//******************************GET INVENTORY********************************/

export const getInventory = async (req, res) => {
  try {
    // Obtener todo el inventario
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .send({ message: "Error fetching inventory", error: error.message });
  }
};

//******************************GET CONTAINERS FROM INVENTORY********************************/

export const getContainers = async (req, res) => {
  try {
    // Obtener solo los números de contenedores del inventario
    const inventory = await Inventory.find({}, "containerNumber");
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .send({ message: "Error fetching inventory", error: error.message });
  }
};

//****************************** FIN DE GET INVENTORY********************************/

export const updateInventory = async (req, res, next) => {
  try {
    const updatedInventory = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedInventory);
  } catch (err) {
    next(err);
  }
};

export const deleteInventory = async (req, res, next) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json("Inventory has been deleted.");
  } catch (err) {
    next(err);
  }
};

// Controlador para modificar la posición de un contenedor en la terminal.

export const updateLocation = async (req, res) => {
  const { containerNumber, locationInTerminal } = req.body;
  console.log('Request body:', req.body);
  try {
    const updatedInventory = await Inventory.findOneAndUpdate(
      { containerNumber }, // Filtra por número de contenedor
      { $set: { locationInTerminal } }, // Actualiza la localización
      { new: true } // Opción para retornar el documento modificado
    );

    if (!updatedInventory) {
      console.log('Container not found in inventory:', containerNumber);
      return res
        .status(404)
        .json({ message: "Contenedor no encontrado en el inventario." });
    }
    console.log('Updated inventory:', updatedInventory);
    res.json(updatedInventory);
  } catch (error) {
    // Verifica si el error es un error de duplicado de MongoDB
    if (error.code === 11000) {
      console.log('Duplicate entry error:', error);
      return res
        .status(400)
        .json({ message: "Ya existe un contenedor en esa posición." });
    }
    // Para otros tipos de errores, mantiene la respuesta genérica
    console.log('General error:', error);
    res
      .status(500)
      .json({
        message: "Error al actualizar la localización del contenedor.",
        error: error.message,
      });
  }
};

/* export const getInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    res.status(200).json(inventory);
  } catch (err) {
    next(err);
  }
};

export const getInventorys = async (req, res, next) => {
 Object.keys(req.query).forEach((key) => {
   if (req.query[key] === "") {
     delete req.query[key];
   }
 });

 console.log(req.query)

}; */

/* export const createContainer = async (req, res, next) => {
  const newContainer = new Container(req.body);

  try {
    const savedContainer = await newContainer.save();
    res.status(200).json(savedContainer);
  } catch (err) {
    next(err);
  }
}; */
