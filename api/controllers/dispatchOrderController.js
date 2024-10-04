import DispatchOrder from "../models/dispatchOrderModel.js";
import Inventory from "../models/inventoryModel.js";

export const createDispatchOrder = async (req, res) => {
  const session = await Inventory.startSession();
  session.startTransaction();
  
  try {
    const newDispatchOrder = new DispatchOrder(req.body);
    const savedDispatchOrder = await newDispatchOrder.save({ session });

    const {
        orderNumber,
        departureType,
        idNumber,
        customerName,
        customsNumber,
        motorVessel,
        containerNumber,
        containerSize,
        containerType,
        isEmpty,
        commodity,
        isNOR,
        weight,
        sealNumber_1,
        sealNumber_2,
        temperature,
        ventilation,
        locationInTerminal,
        truckId,
        truckCo,
        truckDriver,
        consigneeName,
        destination,
        createdBy,
        creationDateTime,
        status,
     
    } = req.body;

   

    // Buscar el inventario correspondiente basado en customerName, customsNumber y ticaSequence
    const inventory = await Inventory.findOne({
      containerNumber,
    }).session(session);
    
    if (!inventory) {
      throw new Error("No se encontró el inventario correspondiente");
    }

    // Guardar los cambios en la base de datos
    await inventory.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({ message: 'Despacho registrada' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error al crear la orden de salida:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getDispatchOrders = async (req, res) => {
  try {
    const dispatchOrders = await DispatchOrder.find();
    res.status(200).json(dispatchOrders);
  } catch (error) {
    console.error("Error al obtener los despachos:", error);
    res.status(500).json({ message: "Error al obtener los despachos" });
  }
};

// Controlador para actualizar el estado de una orden de salida

export const updateDispatchOrderStatus = async (req, res) => {
  const { dispatchOrderNumber, status } = req.body;

  try {
    const dispatchOrder = await DispatchOrder.findOne({ orderNumber });

    if (!dispatchOrder) {
      return res.status(404).json({ message: "Orden de salida no encontrada" });
    }

    dispatchOrder.status = status;
    await dispatchOrder.save();

    res.status(200).json(dispatchOrder);
  } catch (error) {
    console.error(
      "Error al actualizar el despacho:",
      error
    );
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

export const getDispatchOrdersByCustomer = async (req, res) => {
  const { customer } = req.params;
  try {
    const dispatchOrders = await DispatchOrder.find({ customer });
    res.status(200).json(dispatchOrders);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al obtener los despachos",
        error: error.message,
      });
  }
};
