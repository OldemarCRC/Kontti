import mongoose from "mongoose";
const MovementSchema = new mongoose.Schema(
  {
    movement: {
      type: String,
      required: true,
      enum: ["In", "Out"],
    },
    entryType: {
      type: String,
      enum: ["import", "customsAux", "fromShipperOrConsignee"],
      required: function () {
        return this.movement === "In";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    departureType: {
      type: String,
      enum: ["export", "toConsignee", "toCustomsAux"],
      required: function () {
        return this.movement === "Out";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    customsNumber: {
      type: Number,
      required: function () {
        return this.entryType === "import" || this.departureType === "export";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    motorVessel: {
      type: String,
      required: function () {
        return this.entryType === "import" || this.departureType === "export";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    dateAndTime: {
      type: Date,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    containerNumber: {
      type: String,
      required: true,
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
      required: true,
    },
    commodity: {
      type: String,
      required: true
      },
    weight: {
      type: Number,
      required: true,
    },
    portOfDestination: {
      type: String,
      required: function () {
        return this.departureType === "export";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    portOfOrigin: {
      type: String,
      required: function () {
        return this.entryType === "import";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    consigneeName: {
      type: String,
      required: function () {
        return this.departureType === "toConsignee";
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
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
    /*Non-Operating Reefer*/
    isNOR: {
      type: Boolean,
      required: function () {
        return (
          !this.isEmpty &&
          (this.containerType === "RF" || this.containerType === "RFH")
        );
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    temperature: {
      type: String,
      required: function () {
        return !this.isEmpty && !this.isNOR;
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    ventilation: {
      type: String,
      required: function () {
        return !this.isEmpty && !this.isNOR;
      },
      set: function(v) {
        if (v === "") return undefined;
        return v;
      }
    },
    TIRNumber: {
      type: String,
      required: false,
    },

    /*aun no confirmo con el usuario si los siguientes dos atributos son necesarios
    ticaSequence: {
      type: Number,
      required: true,
    },
    BLNumber: {
      type: String,
      required: false,
    },
*/
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
    notes: {
      //observaciones en listados
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { collection: "movements" }
);

MovementSchema.pre("validate", function (next) {
  if (this.movement === "In" && this.departureType) {
    this.invalidate(
      "departureType",
      "departureType should not be set when movement is In"
    );
  }
  if (this.movement === "Out" && this.entryType) {
    this.invalidate(
      "entryType",
      "entryType should not be set when movement is Out"
    );
  }
  next();
});

export default mongoose.model("Movement", MovementSchema);
