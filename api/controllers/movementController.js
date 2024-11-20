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

      const inventoryData = {
        customerName: savedMovement.customerName,
        customsNumber: savedMovement.customsNumber,
        motorVessel: savedMovement.motorVessel,
        dateAndTime: savedMovement.dateAndTime,
        containerNumber: savedMovement.containerNumber,
        containerSize: savedMovement.containerSize,
        containerType: savedMovement.containerType,
        isEmpty: savedMovement.isEmpty,
        commodity: savedMovement.commodity,
        isNOR: savedMovement.isNOR,
        weight: savedMovement.weight,
        consigneeName: savedMovement.consigneeName,
        portOfOrigin: savedMovement.portOfOrigin,
        portOfDestination: savedMovement.portOfDestination,
        sealNumber_1: savedMovement.sealNumber_1,
        sealNumber_2: savedMovement.sealNumber_2,
        temperature: savedMovement.temperature,
        ventilation: savedMovement.ventilation,
        locationInTerminal: savedMovement.locationInTerminal,
        notes: savedMovement.notes,
        reeferDamage: savedMovement.reeferDamage,
        boxDamage: savedMovement.boxDamage,
        damageComments: savedMovement.damageComments,
      };
      // Crea un nuevo documento en el inventario.
      const newInventoryItem = new Inventory(inventoryData);
      await newInventoryItem.save();
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

export const getMovements = async (req, res) => {
  try{
  const movements = await Movement.find();
  res.status(200).json(movements);
}catch (error) {
  console.error("Error al obtener los movimientos:", error);
  res.status(500).json({ message: "Error al obtener los movimientos" });
}
};

