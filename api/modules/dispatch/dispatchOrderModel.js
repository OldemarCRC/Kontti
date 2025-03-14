import mongoose from "mongoose";

const DispatchOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      trim: true,
    },
    idNumber: {
      type: String,
      required: false,
    },
    customerName: {
      type: String,
      required: true,
    },
    manifestNumber: {
      type: String,
      required: true,
    },
    motorVessel: {
      type: String,
      required: false,
    },
    departureType: {
      type: String,
      enum: ["export", "toConsignee", "toShipper", "toCustomsAux"],
      required: true,
    },
    destination: {
      type: String,
      required: function () {
        return this.movement === "Out" &&
          ["toConsignee", "toShipper", "toCustomsAux"].includes(this.departureType);
      },
      set: function (v) {
        if (v === "") return undefined;
        return v;
      }
    },
    portOfDestination: {
      type: String,
      required: function () {
        return this.departureType === "export";
      },
      set: function (v) {
        if (v === "") return undefined;
        return v;
      }
    },
    consigneeName: {
      type: String,
      required: function () {
        return this.departureType === "toConsignee";
      },
      set: function (v) {
        if (v === "") return undefined;
        return v;
      }
    },
    shipperName: {
      type: String,
      required: function () {
        return this.departureType === "toShipper";
      },
      set: function (v) {
        if (v === "") return undefined;
        return v;
      }
    },
    creationDateTime: {
      type: Date,
      required: true,
    },
    containerNumber: {
      type: String,
      required: true,
    },
    containerSize: {
      type: Number,
      required: true,
    },
    containerType: {
      type: String,
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
    temperature: {
      type: String,
      required: false,
    },
    ventilation: {
      type: String,
      required: false,
    },
    weight: {
      type: Number,
      required: false,
    },
    truckId: {
      type: String,
      required: true,
    },
    truckCo: {
      type: String,
      required: true,
    },
    truckDriver: {
      type: String,
      required: true,
    },
    sealNumber_1: {
      type: String,
      required: false,
    },
    sealNumber_2: {
      type: String,
      required: false,
    },
    damageComments: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    locationInTerminal: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["created", "dispatched", "deleted"],
      default: "created",
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  {
    collection: "dispatchOrders",
    timestamps: true,
  }
);

export default mongoose.model("DispatchOrder", DispatchOrderSchema);

