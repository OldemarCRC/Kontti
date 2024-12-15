import createApp from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 8800;

const startServer = async () => {
  const app = createApp();
  await connectDB();
  app.listen(PORT, () => console.log(`Connected to backend on port:${PORT}`));
};

startServer();
