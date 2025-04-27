import express from "express";

import { adminOnly, protect } from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  getUser,
  getUserById,
} from "../controllers/userController.js";

const routes = express.Router();

//User Manageent Routes
routes.get("/", protect, adminOnly, getUser);
routes.get("/:id", protect, getUserById);
routes.delete("/:id", protect, adminOnly, deleteUser);

export default routes;
