import express from "express";

import { config } from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./db/index.js";

config();

const app = express();

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
  connectDB();
});
