import DispatchOrder from "./dispatchOrderModel.js";
import Inventory from "../inventory/inventoryModel.js";

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
        manifestNumber,
        motorVessel,
        containerNumber,
        containerSize,
        containerType,
        isEmpty,
        commodity,
        isNOR,
        weight,
        portOfDestination,
        sealNumber_1,
        sealNumber_2,
        temperature,
        ventilation,
        locationInTerminal,
        truckId,
        truckCo,
        truckDriver,
        consigneeName,
        shipperName,
        anotherTerminal,
        destination,
        createdBy,
        creationDateTime,
        status,
     
    } = req.body;

   
    const inventory = await Inventory.findOne({
      containerNumber,
    }).session(session);
    
    if (!inventory) {
      throw new Error("The corresponding inventory was not found");
    }

    inventory.isReservedForDispatch = true;
    inventory.activeDispatchOrderId = savedDispatchOrder._id;
    await inventory.save({ session });

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({ message: 'Container dispatch registered' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error("Error creating dispatch order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getDispatchOrders = async (req, res) => {
  try {
    const dispatchOrders = await DispatchOrder.find();
    res.status(200).json(dispatchOrders);
  } catch (error) {
    console.error("Error fetching dispatches:", error);
    res.status(500).json({ message: "Error fetching dispatches" });
  }
};

export const updateDispatchOrderStatus = async (req, res) => {
  const { orderNumber, status } = req.body;

  try {
    const dispatchOrder = await DispatchOrder.findOne({ orderNumber });

    if (!dispatchOrder) {
      return res.status(404).json({ message: "Dispatch order not found" });
    }

    dispatchOrder.status = status;
    await dispatchOrder.save();

    res.status(200).json(dispatchOrder);
  } catch (error) {
    console.error(
      "Error updating dispatch:",
      error
    );
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
        message: "Error fetching dispatches",
        error: error.message,
      });
  }
};
