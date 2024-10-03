import mongoose from "mongoose";

const customsManifestSchema = new mongoose.Schema({
    customsNumber: {
      type: String,
      required: true,
      unique: true,
    },
    motorVessel: {
      type: String,
      required: false,
    },
    voyageNumber:{
      type:String,
      require:false,
    },
    officialArrivalDate: {
      type: Date,
      required: true,
    },
    transportMode: {
      type: String,
      required: true,
      enum: ["Maritime", "Air", "Land"],
    },
    customsManifestType: {
      type: String,
      required: true,
      enum: ["in", "out"],
    },
    customsLocationCode: {
      type: String,
      required: true,
      enum: ["A01", "A02", "A03", "A04", "A05", "A06"],
    },
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CustomsManifest", customsManifestSchema);