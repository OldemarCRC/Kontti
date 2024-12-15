import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsConfig from "./config/corsConfig.js";
import configureApp from "./config/appConfig.js";
import registerRoutes from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";

const createApp = () => {
  const app = express();

  configureApp(app);

  app.use(cors(corsConfig));
  app.use(cookieParser());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerRoutes(app);

  app.use(errorHandler);

  return app;
};

export default createApp;
