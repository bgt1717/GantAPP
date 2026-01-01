import Project from "../models/Project.js";

/* =========================
   GET PROJECTS
========================= */
export const getProjects = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const projects = await Project.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   CREATE PROJECT
========================= */
export const createProject = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      user: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE PROJECT
========================= */
export const updateProject = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE PROJECT
========================= */
export const deleteProject = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
