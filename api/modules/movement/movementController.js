import Movement from "./movementModel.js";
import Inventory from "../inventory/inventoryModel.js";

export const createMovement = async (req, res) => {
  const { containerNumber, movement } = req.body;
  try {
    const existingInventory = await Inventory.findOne({ containerNumber });

    if (movement === "In") {
      if (existingInventory) {
        return res
          .status(400)
          .json({ message: "The container is already in the inventory." });
      }
      const newMovement = new Movement(req.body);
      const savedMovement = await newMovement.save();

      const inventoryData = {
        customerName: savedMovement.customerName,
        manifestNumber: savedMovement.manifestNumber,
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
      const newInventoryItem = new Inventory(inventoryData);
      await newInventoryItem.save();
      res.status(201).json(savedMovement);
    } else if (movement === "Out") {
      if (!existingInventory) {
        return res
          .status(400)
          .json({ message: "The container is not in the inventory." });
      }

      const newMovement = new Movement(req.body);
      const savedMovement = await newMovement.save();
      await Inventory.findOneAndDelete({ containerNumber });

      res.status(201).json(savedMovement);
    } else {
      res.status(400).json({ message: "Invalid value for gateInOrGateOut." });
    }
  } catch (error) {
    console.log(
      "Error creating movement or updating inventory:",
      error
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
  console.error("Error retrieving movements:", error);
  res.status(500).json({ message: "Error retrieving movements" });
}
};
