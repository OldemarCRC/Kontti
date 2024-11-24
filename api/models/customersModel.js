import mongoose from "mongoose";
const CustomerSchema = new mongoose.Schema(
  {
    idType: {
      type: String,
      enum: ['TIC', 'NIC'], 
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true
    },
    customerName: {
      type: String,
      required: true,
      unique: true
    },
    customerAddress: {
      type: String,
      required: true,
    },
    customerContact: {
        type: String,
        required: true,
      },
    customerEmail: {
      type: String,
      required: false,
    },
    customerPhoneNumber: {
      type: String,
      required: false,
    },
    createdBy: {
      type: String,
      required: true,
    },
 
  },
  { collection: "customers",
    timestamps: true,
   }
);

export default mongoose.model("Customer", CustomerSchema);