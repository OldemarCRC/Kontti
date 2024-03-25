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
  
});

export default mongoose.model("Movement", MovementSchema)