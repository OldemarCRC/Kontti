import mongoose from "mongoose";

const TruckCompaniesSchema = new mongoose.Schema(
  {
    idType: {
      type: String,
      enum: ['J', 'F'], // 'J' para jurídica, 'F' para física
      required: true,
    },
    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
    },
    contactEmail: {
      type: String,
      validate: {
        validator: function (v) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validación básica de email
        },
        message: (props) => `${props.value} no es un correo electrónico válido.`,
      },
    },
    address: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { collection: "TruckCompanies",
    timestamps: true,
  }
);

export default mongoose.model("TruckCompany", TruckCompaniesSchema);
