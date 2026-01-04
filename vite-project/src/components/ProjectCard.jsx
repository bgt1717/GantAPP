import { useState, useEffect } from "react";
import GanttChart from "./GanttChart";

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

  // Fetch tasks for this project on mount
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: taskName, startDate, endDate }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to add task");
      }

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);

      // Reset form and hide
      setTaskName("");
      setStartDate("");
      setEndDate("");
      setShowAddTask(false);
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
    <div style={{ border: "1px solid #ddd", color: "black", padding: "16px", borderRadius: "8px", marginBottom: "12px", background: "#fff" }}>
      {/* ---------- Project section ---------- */}
      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={saveProject} style={{ background: "#1976d2", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>Save</button>
          <button onClick={() => setEditing(false)} style={{ background: "#9e9e9e", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer", marginLeft: "8px" }}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{project.name}</h3>
          {project.description && <p>{project.description}</p>}
          <button onClick={() => setEditing(true)} style={{ marginRight: "8px" }}>Edit</button>
          <button onClick={() => onDelete(project._id)} style={{ marginRight: "8px" }}>Delete</button>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            style={{ background: "#8bc34a", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}
          >
            Add Task
          </button>
        </>
      )}

      {/* ---------- Toggleable Add Task form ---------- */}
      {showAddTask && (
        <div style={{ marginTop: "12px", background: "black", padding: "12px", borderRadius: "6px" }}>
          <input
            type="text"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            style={{ width: "100%", padding: "6px", marginBottom: "6px" }}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ width: "48%", padding: "6px", marginRight: "4%" }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ width: "48%", padding: "6px" }}
          />
          <button onClick={addTask} style={{ marginTop: "6px", background: "#1976d2", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer" }}>+ Add Task</button>
        </div>
      )}

      {/* ---------- Task list ---------- */}
      {tasks.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <h4>Tasks</h4>
          {tasks.map((task) => (
            <div key={task._id} style={{ border: "1px solid #020202ff", color: "black", padding: "8px", marginBottom: "6px", borderRadius: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{task.name} ({task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"} → {task.endDate ? new Date(task.endDate).toLocaleDateString() : "-"})</span>
              <button onClick={() => deleteTask(task._id)} style={{ background: "#e53935", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
            </div>
          ))}
       {/* ---------- Gantt Chart ---------- */}
        {tasks.length > 0 && <GanttChart tasks={tasks} />}
        </div>
      )}
    </div>
  );
}
