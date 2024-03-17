import mongoose from "mongoose";
const ContainerSchema = new mongoose.Schema({
  gateInOrGateOut: {
    type: String,
    required: true,
  },
  customer: {
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
    type: Number,//En la DB se guarda segun se indique aqui sin importar si en frontend no es el mismo
    required: false,
  },
  containerType: {
    type: String,
    required: true,
  },
  fullOrEmpty: {
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
  sealNumber: {
    type: String,
    required: true,
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
  locationInTerminal: {
    type: 
      {
      "zone": String,
      "stack": Number,
      "column": String,
      "height": Number
    }
    ,
    required: false,
  },
  digitVerification: {
    type: {
      "actualDigit": Number,//En la DB se guarda segun se indique aqui sin importar si en frontend no es el mismo
      "expectedDigit": Number,//En la DB se guarda segun se indique aqui sin importar si en frontend no es el mismo
      "matches": Boolean
    },
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  
});

export default mongoose.model("Container", ContainerSchema)