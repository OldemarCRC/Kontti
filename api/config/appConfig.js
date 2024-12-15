import dotenv from "dotenv";

const configureApp = (app) => {
  dotenv.config();
  app.set("trust proxy", 1);
};

export default configureApp;