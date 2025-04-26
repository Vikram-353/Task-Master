import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";
import { log } from "console";

dotenv.config();
const app = express();

//MiddleWare to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//Middleware
app.use(express.json());

//Routes

//Start Server

const PORT = process.env.PORT || 500;
app.listen(PORT, () => log(`Server running on port ${PORT}`));
