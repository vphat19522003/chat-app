import express from "express";

import { config } from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectDB from "./db/index.js";
import bodyParser from "body-parser";

config();

const app = express();

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
  connectDB();
});
