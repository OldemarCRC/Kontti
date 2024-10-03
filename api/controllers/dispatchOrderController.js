import DispatchOrder from "../models/dispatchOrderModel.js";
import Inventory from "../models/inventoryModel.js";

export const createDispatchOrder = async (req, res) => {
  const session = await Inventory.startSession();
  session.startTransaction();
  
  try {
    const newOrder = new DispatchOrder(req.body);
    const savedOrder = await newOrder.save({ session });

    const {
      customerName,
      customsNumber,
      ticaSequence,
      lineNumber: receivedLineNumber,
      quantity,
      orderNumber,
     
    } = req.body;

    // Verifica que receivedLineNumber sea un objeto y tenga el campo lineNumber
   /*  if (!receivedLineNumber || !receivedLineNumber.lineNumber) {
      return res.status(400).json({ error: 'lineNumber debe ser un objeto con la propiedad lineNumber.' });
    } */

    // Extrae el número de línea del objeto
  /*   const lineNumber = receivedLineNumber.lineNumber; */

    // Verificar que lineNumber sea proporcionado y convertirlo a número
 /*    if (!lineNumber) {
      return res.status(400).json({ error: 'El número de línea (lineNumber) es requerido.' });
    } */

    // Buscar el inventario correspondiente basado en customerName, customsNumber y ticaSequence
    const inventory = await Inventory.findOne({
      containerNumber,
    }).session(session);
    
    if (!inventory) {
      throw new Error("No se encontró el inventario correspondiente");
    }

    // Buscar la línea del BL correcta en el inventario
  /*   const selectedLine = inventory.BLLines.find(line => line.lineNumber === lineNumber); */

    // Verificar si se encontró la línea
  /*   if (!selectedLine) {
      return res.status(404).json({ error: `No se encontró la línea ${lineNumber} en el inventario.` });
    } */

    // Asegurarse de que quantity sea un número
  /*   const quantityNumber = parseInt(quantity, 10);
    if (isNaN(quantityNumber)) {
      return res.status(400).json({ error: 'La cantidad (quantity) debe ser un número válido.' });
    } */

    // Verificar si hay suficientes bultos en la línea seleccionada
  /*   if (selectedLine.availableQuantity < quantityNumber) {
      return res.status(400).json({ error: 'No hay suficientes bultos en la línea del BL para completar la orden de salida.' });
    } */

    // Actualizar la cantidad de bultos y otras propiedades en la línea seleccionada
/*     selectedLine.availableQuantity -= quantityNumber;
    selectedLine.releaseOrders.push(orderNumber); */

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
  const { orderNumber, status } = req.body;

  try {
    const dispatchOrder = await DispatchOrder.findOne({ orderNumber });

    if (!dispatchOrder) {
      return res.status(404).json({ message: "Orden de salida no encontrada" });
    }

    dispatcheOrder.status = status;
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
