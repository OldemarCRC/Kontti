import authRoute from "../modules/auth/authRoute.js";
import usersRoute from "../modules/users/usersRoute.js";
import movementRoute from "../modules/movement/movementRoute.js";
import onLineUsersRouter from "../modules/users/onLineUsersRoute.js";
import inventoryRoute from "../modules/inventory/inventoryRoute.js";
import customersRoute from "../modules/customers/customersRoute.js";
import dispatchOrderRoute from "../modules/dispatch/dispatchOrderRoute.js";
import truckCompaniesRoute from "../modules/truck_companies/truckCompaniesRoute.js";
import manifestRoute from "../modules/manifest/manifestRoute.js";

const registerRoutes = (app) => {
  app.use("/api/auth", authRoute);
  app.use("/api/users", usersRoute);
  app.use("/api/movements", movementRoute);
  app.use("/api/inventory", inventoryRoute);
  app.use("/api/customers", customersRoute);
  app.use("/api/dispatchOrder", dispatchOrderRoute);
  app.use("/api/truck-companies", truckCompaniesRoute);
  app.use("/api/manifest", manifestRoute);
  app.use("/api", onLineUsersRouter);
};

export default registerRoutes;