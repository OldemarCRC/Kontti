import mongoose from "mongoose";

const TruckCompaniesSchema = new mongoose.Schema(
  {
    idType: {
      type: String,
      enum: ['TIC', 'NIC'],
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
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: (props) => `${props.value} it is not a valid email account.`,
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
