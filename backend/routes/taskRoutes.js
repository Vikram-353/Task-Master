import express from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import {
  getDashboardData,
  getTasks,
  getTasksById,
  getUserDashboardData,
  deleteTask,
  createTasks,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
} from "../controllers/taskController.js";

const router = express.Router();

//Task management
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks);
router.get("/:id", protect, getTasksById);
router.post("/", protect, adminOnly, createTasks);
router.put("/:id", protect, updateTask);
router.post("/:id", protect, adminOnly, deleteTask);
router.put("/:id/status", protect, updateTaskStatus);
router.put("/:id/todo", protect, updateTaskChecklist);

export default router;
