import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* Get user projects */
router.get("/", authMiddleware, async (req, res) => {
  const projects = await Project.find({ owner: req.userId });
  res.json(projects);
});

/* Create project */
router.post("/", authMiddleware, async (req, res) => {
  const project = await Project.create({
    name: req.body.name,
    owner: req.userId
  });

  res.status(201).json(project);
});

export default router;
