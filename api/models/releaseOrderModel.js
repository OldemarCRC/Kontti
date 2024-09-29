import mongoose from "mongoose";

const ReleaseOrderSchema = new mongoose.Schema({

  orderNumber: {
    type: String,
    required: true,
    trim: true,
  },

  idNumber: {
    type: String,
    required: true,

  },

  customerName: {
    type: String,
    required: true,

  },

  customsNumber: {
    type: Number,
    required: true,
    trim: true,
  },

  BLNumber: {
    type: String,
    required: false,
    trim: true,
  },

  ticaSequence: {
    type: Number,
    required: true,
  },

  BLLineNumber: {
    type: Number,
    required: true,
  },

  commodity: {
    type: String,
    required: true,
    trim: true,
  },

  DUANumber: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 0,
  },

  packageType: {
    type: String,
    required: true,
    enum: ["BAG", "BOX", "PKG", "UNT", "VEH", "PAE", "TRY"],
  },

  storageLocations: {
    type: [String],
    required: true,
  },
  
  creationDateTime: {
    type: Date,
    required: true,
  },

  truckCo: {
    type: String,
    required: true,
    trim: true,
  },

  truckId: {
    type: String,
    required: true,
    trim: true,
  },

  truckDriver: {
    type: String,
    required: true,
    trim: true,
  },

  containerNumber: {
    type: String,
    required: true,
    trim: true,
  },

  sealNumber_1: {
    type: String,
    trim: true,
    default: null,
  },
  
  sealNumber_2: {
    type: String,
    trim: true,
    default: null,
  },
  
  status: {
    type: String,
    required: true,
    enum: ['created', 'dispatched','deleted'],
    default: 'created'
  },
  createdBy: {
    type: String,
    required: true,
  },
  
}, {
  collection: "releaseOrders",
  timestamps: true,
});

export default mongoose.model("ReleaseOrder", ReleaseOrderSchema);