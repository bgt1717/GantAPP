import { useState, useEffect } from "react";
import GanttChart from "./GanttChart";
import "./ProjectCard.css";

const API_PROJECTS = "http://localhost:5000/api/projects";

export default function ProjectCard({ project, onDelete, onUpdate }) {
  const token = localStorage.getItem("token");

  // ---------- Project edit ----------
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  // ---------- Task management ----------
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks", err);
      }
    };
    fetchTasks();
  }, [project._id, token]);

  // ---------- Save project edits ----------
  const saveProject = async () => {
    try {
      const res = await fetch(`${API_PROJECTS}/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, description }),
      });
      const updated = await res.json();
      onUpdate(updated);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update project", err);
      alert("Update failed");
    }
  };

  // ---------- Add task ----------
  const addTask = async () => {
    if (!taskName.trim()) return;
    try {
      const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: taskName, startDate, endDate }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add task");
      }
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTaskName(""); setStartDate(""); setEndDate(""); setShowAddTask(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // ---------- Delete task ----------
  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API_PROJECTS}/${project._id}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete task");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="project-card">
      {/* ---------- Project Section ---------- */}
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <button className="edit-btn" onClick={saveProject}>Save</button>
          <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{project.name}</h3>
          {project.description && <p>{project.description}</p>}
          <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
          <button className="delete-btn" onClick={() => onDelete(project._id)}>Delete</button>
          <button className="add-task-toggle" onClick={() => setShowAddTask(!showAddTask)}>Add Task</button>
        </>
      )}

      {/* ---------- Add Task Form ---------- */}
      {showAddTask && (
        <div className="add-task-form">
          <input type="text" placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button onClick={addTask}>+ Add Task</button>
        </div>
      )}

      {/* ---------- Task List ---------- */}
      {tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              projectId={project._id}
              token={token}
              deleteTask={deleteTask}
              updateTask={(updatedTask) => setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)))}
            />
          ))}
          <GanttChart tasks={tasks} />
        </div>
      )}
    </div>
  );
}

// ---------- TaskItem Component ----------
function TaskItem({ task, projectId, token, deleteTask, updateTask }) {
  const [editingTask, setEditingTask] = useState(false);
  const [editName, setEditName] = useState(task.name);
  const [editStart, setEditStart] = useState(task.startDate || "");
  const [editEnd, setEditEnd] = useState(task.endDate || "");

  const saveTask = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/tasks/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, startDate: editStart, endDate: editEnd }),
      });
      if (!res.ok) throw new Error("Failed to update task");
      const updated = await res.json();
      updateTask(updated);
      setEditingTask(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="task-item">
      {!editingTask ? (
        <>
          <span>{task.name} ({task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"} → {task.endDate ? new Date(task.endDate).toLocaleDateString() : "-"})</span>
          <div>
            <button className="edit-btn" onClick={() => setEditingTask(true)}>Edit</button>
            <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
          </div>
        </>
      ) : (
        <div className="task-edit-form">
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
          <input type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
          <input type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
          <button className="save-btn" onClick={saveTask}>Save</button>
          <button className="cancel-btn" onClick={() => setEditingTask(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
