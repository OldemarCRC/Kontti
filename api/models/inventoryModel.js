import mongoose from "mongoose";
const InventorySchema = new mongoose.Schema({
  customer: {
    //naviera en listados
    type: String,
    required: true,
  },
  containerNumber: {
    type: String,
    required: true,
    unique: true,
  },

  containerSize: {
    type: Number,
    required: true,
  },
  containerType: {
    type: String,
    required: true,
  },
  fullOrEmpty: {
    ///status en listados de movimientos e inventarios
    type: String,
    required: true,
  },
  dateAndTime: {
    type: Date,
    required: true,
  },

  origin: {
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

  locationInTerminal: {
    type: {
      zone: String,
      stack: Number,
      column: String,
      height: Number,
    },
    required: false,
  },

  weight:{
    type:  Number,
    required:false
   },

  notes: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Inventory", InventorySchema);




// Método virtual para calcular 'days' sobre la marcha
//para mostrar en inventario los dias en predio de un contenedor
/* inventorySchema.virtual('days').get(function () {
    const now = new Date();
    const diff = now - this.gateInDate; // Diferencia en milisegundos
    return Math.floor(diff / (1000 * 60 * 60 * 24)); // Convertir a días
  });
  
  const Inventory = mongoose.model('Inventory', inventorySchema);
  
  export default Inventory; */
