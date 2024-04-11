import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import usersRoute from "./routes/usersRoute.js";
import movementRoute from "./routes/movementRoute.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected!");
});

//middlewares
app.use(cors());
app.use(cookieParser());

// Aumentar el límite de tamaño para solicitudes JSON y URL-encoded
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/movements", movementRoute);
app.use("/api/inventory", inventoryRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(process.env.PORT, () => {
  connect();
  console.log(`Connected to backend on port:${process.env.PORT}`);
});
