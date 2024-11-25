import mongoose from "mongoose";
const InventorySchema = new mongoose.Schema(
  {
    customerName: {
      //naviera en listados
      type: String,
      required: true,
    },
    manifestNumber: {
      type: Number,
      required: false,
    },
    motorVessel: {
      type: String,
      required: false,
    },
    dateAndTime: {
      type: Date,
      required: true,
    },
    containerNumber: {
      type: String,
      required: true,
      unique: true,
    },
    containerSize: {
      type: Number,
      enum: [10, 20, 40, 45],
      required: true,
    },
    containerType: {
      type: String,
      enum: ["DV", "DC", "HC", "RF", "RFH", "OT", "FR"],
      required: true,
    },
    isEmpty: {
      type: Boolean,
      required: false,
    },
    commodity: {
      type: String,
      required: true,
    },
    isNOR: {
      type: Boolean,
      required: false,
    },
    weight: {
      type: Number,
      required: true,
    },
    consigneeName: {
      type: String,
      required: false,
    },
    portOfOrigin: {
      type: String,
      required: false,
    },
    portOfDestination: {
      type: String,
      required: false,
    },
    sealNumber_1: {
      type: String,
      required: false,
    },
    sealNumber_2: {
      type: String,
      required: false,
    },
    temperature: {
      type: String,
      required: false,
    },
    ventilation: {
      type: String,
      required: false,
    },
    locationInTerminal: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    reeferDamage: {
      type: Boolean,
      default: false,
      require: false,
    },
    boxDamage: {
      type: Boolean,
      default: false,
      require: false,
    },
    damageComments: {
      type: String,
      required: false,
    },
  },
  { collection: "inventory" }
); // Especifica el nombre de la colección aquí);

export default mongoose.model("Inventory", InventorySchema);