import Movement from "../models/movementModel.js";
import Inventory from "../models/inventoryModel.js";

export const createMovement = async (req, res) => {
  const { containerNumber, movement } = req.body;
  try {
    // Primero, verifica si el contenedor ya existe en el inventario
    const existingInventory = await Inventory.findOne({ containerNumber });
  
   // Verifica si el movimiento es un ingreso
    if (movement === "In") {
      //Verifica si el contenedor ya está en el inventario.
      if (existingInventory) {
        return res
          .status(400)
          .json({ message: "El contenedor ya se encuentra en el inventario." });
      }
      // Si el contenedor no está en el inventario, procede a insertar el nuevo movimiento
      const newMovement = new Movement(req.body);
      const savedMovement = await newMovement.save();
      

      /* const inventoryData = {
        customer: savedMovement.customer,
        containerNumber: savedMovement.containerNumber,
        containerSize: savedMovement.containerSize,
        containerType: savedMovement.containerType,
        fullOrEmpty: savedMovement.fullOrEmpty,
        dateAndTime: savedMovement.dateAndTime,
        origin: savedMovement.originOrDestination,
        portOfDestination: savedMovement.portOfDestination,
        exportVessel: savedMovement.exportVessel,
        sealNumber_1: savedMovement.sealNumber_1,
        sealNumber_2: savedMovement.sealNumber_2,
        temperature: savedMovement.temperature,
        ventilation: savedMovement.ventilation,
        weight: savedMovement.weight,
        notes: savedMovement.notes, */
        // Añade aquí más campos si son necesarios
      /* }; */
      // Crea un nuevo documento en el inventario.
      /* const newInventoryItem = new Inventory(inventoryData);
      await newInventoryItem.save();*/
      res.status(201).json(savedMovement);
    }
    // Manejo para movimiento de salida
    else if (movement === "Out") {
      if (!existingInventory) {
        return res
          .status(400)
          .json({ message: "El contenedor no se encuentra en el inventario." });
      }

      // Procede a insertar el nuevo movimiento
      const newMovement = new Movement(req.body);
      const savedMovement = await newMovement.save();

      // Borrar documento del inventario
      await Inventory.findOneAndDelete({ containerNumber });

      res.status(201).json(savedMovement);
    } else {
      // Manejo de valores inesperados para gateInOrGateOut
      res.status(400).json({ message: "Valor inválido para gateInOrGateOut." });
    }
  } catch (error) {
    console.log(
      "Error creando el movimiento o actualizando el inventario:",
      error
    );
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const updateMovement = async (req, res, next) => {
  try {
    const updatedMovement = await Movement.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedMovement);
  } catch (err) {
    next(err);
  }
};

export const deleteMovement = async (req, res, next) => {
  try {
    await Movement.findByIdAndDelete(req.params.id);
    res.status(200).json("Movement has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getMovement = async (req, res, next) => {
  try {
    const movement = await Movement.findById(req.params.id);
    res.status(200).json(movement);
  } catch (err) {
    next(err);
  }
};

export const getMovements = async (req, res, next) => {
  Object.keys(req.query).forEach((key) => {
    if (req.query[key] === "") {
      delete req.query[key];
    }
  });

  console.log(req.query);
};

/*
export const createMovement = async (req, res) => {
  try {
    // Verifica si el cuerpo de la solicitud es un array
    if (Array.isArray(req.body)) {
      // Inserta múltiples documentos
      const movements = await Movement.insertMany(req.body);
      res.status(201).json(movements);
    } else {
      // Inserta un solo documento
      const newMovement = new Movement(req.body);
      await newMovement.save();
      res.status(201).json(newMovement);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
*/
