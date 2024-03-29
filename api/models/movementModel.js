import mongoose from "mongoose";
const MovementSchema = new mongoose.Schema({
  gateInOrGateOut: {
    type: String,
    required: true,
  },
  customer: {//naviera en listados
    type: String,
    required: true,
  },
  containerNumber: {
    type: String,
    required: true,
  },
  truckID: {
    type: String,
    required: true,
  },
  truckCo: {
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
  fullOrEmpty: {///status en listados de movimientos e inventarios
    type: String,
    required: true,
  },
  dateAndTime: {
    type: Date,
    required: true,
  },
  originOrDestination: {
    type: String,
    required: true,
  },

  portOfDestination: {
    type: String,
    required: false,
  },

  exportVessel: {
    type: String,
    required: false,
  },

  reeferDamage: {
    type: Boolean,
    default: false,
    require:  false,
  },

  boxDamage: {
    type: Boolean,
    default: false,
    require:  false,
  },

  damageComments :{
     type:String,
     required: false
  } ,
  
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
  TIRNumber: {
    type: String,
    required: false,
  },
  weight:{
    type:  Number,
    required:false
   },
  notes: {//observaciones en listados
    type: String,
    required: false,
  },
  
},{ collection: 'movements' });

export default mongoose.model("Movement", MovementSchema)