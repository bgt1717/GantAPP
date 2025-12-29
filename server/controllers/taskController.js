import Task from "../models/Task.js";

// Create task
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      name: req.body.name,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      project: req.params.projectId,
      owner: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get tasks for project
export const getTasksByProject = async (req, res) => {
  const tasks = await Task.find({
    project: req.params.projectId,
    owner: req.user._id,
  });

  res.json(tasks);
};

// Update task
export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  Object.assign(task, req.body);
  const updated = await task.save();

  res.json(updated);
};

// Delete task
export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (task.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: "Not authorized" });
  }

  await task.deleteOne();
  res.json({ message: "Task removed" });
};
