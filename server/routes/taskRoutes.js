import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router({ mergeParams: true });

// /api/projects/:projectId/tasks
router.route("/")
  .get(protect, getTasksByProject)
  .post(protect, createTask);

router.route("/:taskId")
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;
