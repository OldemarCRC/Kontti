const corsConfig = {
    origin: [process.env.BASE_URL || "http://localhost:3000"],
    credentials: true,
  };
  
  export default corsConfig;  