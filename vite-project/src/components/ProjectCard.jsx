import { useState, useEffect } from "react";
import GanttChart from "./GanttChart";
import "./ProjectCard.css";

const API_PROJECTS = "http://localhost:5000/api/projects";

export default function ProjectCard({ project, onDelete, onUpdate }) {
  const token = localStorage.getItem("token");

  /* ---------- Project edit ---------- */
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  /* ---------- Tasks ---------- */
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------- Fetch tasks ---------- */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [project._id, token]);

  /* ---------- Save project ---------- */
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
    } catch {
      alert("Update failed");
    }
  };

  /* ---------- Add task ---------- */
  const addTask = async () => {
    if (!taskName.trim()) return;
    try {
      const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: taskName, startDate, endDate }),
      });
      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTaskName("");
      setStartDate("");
      setEndDate("");
      setShowAddTask(false);
    } catch {
      alert("Failed to add task");
    }
  };

  /* ---------- Delete task ---------- */
  const deleteTask = async (taskId) => {
    try {
      await fetch(`${API_PROJECTS}/${project._id}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch {
      alert("Failed to delete task");
    }
  };

  /* ---------- Update task ---------- */
  const updateTask = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  return (
    <div className="project-card">
      {/* ---------- Project header ---------- */}
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
          <button className="add-task-toggle" onClick={() => setShowAddTask(!showAddTask)}>
            Add Task
          </button>
        </>
      )}

      {/* ---------- Add task form ---------- */}
      {showAddTask && (
        <div className="add-task-form">
          <input placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button onClick={addTask}>+ Add Task</button>
        </div>
      )}

      {/* ---------- GANTT CHART (comes FIRST) ---------- */}
      {tasks.length > 0 && (
        <div className="gantt-wrapper">
          <GanttChart tasks={tasks} />
        </div>
      )}

      {/* ---------- TASK LIST (comes AFTER gantt) ---------- */}
      {tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              projectId={project._id}
              token={token}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- TaskItem ---------- */
function TaskItem({ task, projectId, token, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [startDate, setStartDate] = useState(task.startDate || "");
  const [endDate, setEndDate] = useState(task.endDate || "");

  const save = async () => {
    const res = await fetch(
      `http://localhost:5000/api/projects/${projectId}/tasks/${task._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, startDate, endDate }),
      }
    );
    const updated = await res.json();
    onUpdate(updated);
    setEditing(false);
  };

  return (
    <div className="task-item">
      {!editing ? (
        <>
          <span>{task.name}</span>
          <div>
            <button className="edit-btn" onClick={() => setEditing(true)}>Edit</button>
            <button className="delete-btn" onClick={() => onDelete(task._id)}>Delete</button>
          </div>
        </>
      ) : (
        <div className="task-edit-form">
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button className="save-btn" onClick={save}>Save</button>
          <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
