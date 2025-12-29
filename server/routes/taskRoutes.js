import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* Get tasks for project */
router.get("/:projectId", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ project: req.params.projectId });
  res.json(tasks);
});

/* Create task */
router.post("/", authMiddleware, async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json(task);
});

/* Update task */
router.put("/:id", authMiddleware, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(task);
});

/* Delete task */
router.delete("/:id", authMiddleware, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

export default router;
