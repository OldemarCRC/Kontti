import Inventory from "./inventoryModel.js";

export const getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({});
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .send({ message: "Error fetching inventory", error: error.message });
  }
};

export const getContainers = async (req, res) => {
  try {
    const inventory = await Inventory.find({}, "containerNumber");
    res.json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .send({ message: "Error fetching inventory", error: error.message });
  }
};

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

export const updateLocation = async (req, res) => {
  const { containerNumber, locationInTerminal } = req.body;
  console.log('Request body:', req.body);
  try {
    const updatedInventory = await Inventory.findOneAndUpdate(
      { containerNumber }, 
      { $set: { locationInTerminal } }, 
      { new: true } 
    );

    if (!updatedInventory) {
      console.log('Container not found in inventory:', containerNumber);
      return res
        .status(404)
        .json({ message: "Container not found in inventory." });
    }
    console.log('Updated inventory:', updatedInventory);
    res.json(updatedInventory);
  } catch (error) {
    if (error.code === 11000) {
      console.log('Duplicate entry error:', error);
      return res
        .status(400)
        .json({ message: "A container already exists in that location." });
    }
    console.log('General error:', error);
    res
      .status(500)
      .json({
        message: "Error updating container location.",
        error: error.message,
      });
  }
};

