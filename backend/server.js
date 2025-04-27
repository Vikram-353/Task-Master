import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";
import path from "path";
import { log } from "console";
// import { connect } from "http2";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

connectDB();

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
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
// app.use("/api/reports",reportRoutes);

//Start Server
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API WORKING GREAT");
});

app.listen(PORT, () => log(`Server running on port ${PORT}`));
