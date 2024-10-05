import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "manager", "dispatcher", "operator", "externalUser", "gate","surveyor", "accounting",],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    lockedAt: {
      type: Date,
      default: null
    },
    lastLoginAttempt: {
      type: Date,
      default: null
    },
    loginAttempts: [{
      date: Date,
      ip: String
    }],
    passwordChangeRequired: {
      type: Boolean,
      default: true
    },
    passwordExpiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutos desde la creación
    },
    createdBy: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);