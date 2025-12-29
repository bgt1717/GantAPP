import Project from "../models/Project.js";

// Create project
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      owner: req.user._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user's projects
export const getProjects = async (req, res) => {
  const projects = await Project.find({ owner: req.user._id });
  res.json(projects);
};

// Update project
export const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  project.name = req.body.name || project.name;
  const updated = await project.save();

  res.json(updated);
};

// Delete project
export const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await project.deleteOne();
  res.json({ message: "Project removed" });
};
