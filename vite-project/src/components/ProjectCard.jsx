import { useEffect, useState } from "react";
import GanttChart from "./GanttChart";
import "./ProjectCard.css";

const API_PROJECTS = "http://localhost:5000/api/projects";



export default function ProjectCard({ project, onDelete, onUpdate }) {
  const token = localStorage.getItem("token");

  /* ---------- Project edit ---------- */
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  /* ---------- Tasks state ---------- */
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  /* ---------- Add task form ---------- */
  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ---------- Editing task ---------- */
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  /* ---------- Fetch tasks ---------- */
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, [project._id, token]);

  /* ---------- Save project ---------- */
  const saveProject = async () => {
    const res = await fetch(`${API_PROJECTS}/${project._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description }),
    });
    const updated = await res.json();
    onUpdate(updated);
    setEditing(false);
  };

  /* ---------- Add task ---------- */
  const addTask = async () => {
    if (!taskName.trim()) return;

    const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: taskName, startDate, endDate }),
    });

    const newTask = await res.json();
    setTasks((prev) => [...prev, newTask]);
    setTaskName("");
    setStartDate("");
    setEndDate("");
    setShowAddTask(false);
  };

  /* ---------- Start editing task ---------- */
  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTaskName(task.name);
    setEditStartDate(task.startDate?.slice(0, 10) || "");
    setEditEndDate(task.endDate?.slice(0, 10) || "");
  };

  /* ---------- Save task edits ---------- */
  const saveTask = async (taskId) => {
    const res = await fetch(
      `${API_PROJECTS}/${project._id}/tasks/${taskId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editTaskName,
          startDate: editStartDate,
          endDate: editEndDate,
        }),
      }
    );

    const updatedTask = await res.json();
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? updatedTask : t))
    );
    setEditingTaskId(null);
  };

  /* ---------- Delete task ---------- */
  const deleteTask = async (taskId) => {
    await fetch(`${API_PROJECTS}/${project._id}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return (
    <div className="project-card">
      {/* ---------- Project header ---------- */}
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button className="save-btn" onClick={saveProject}>Save</button>
          <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{project.name}</h3>
          {project.description && <p>{project.description}</p>}
        </>
      )}

      {/* ---------- Gantt chart ---------- */}
      {tasks.length > 0 && <GanttChart tasks={tasks} />}

      {/* ---------- Buttons section ---------- */}
      <div className="project-actions">
        <button
          className="btn-add"
          onClick={() => setShowAddTask(!showAddTask)}
        >
          Add Task
        </button>
        {/* Delete project always visible */}
        <button className="btn-delete" onClick={() => onDelete(project._id)}>Delete Project</button>
      
        {/* Only show when tasks exist */}
        {tasks.length > 0 && (
          <>
            <button onClick={() => setEditing(true)}>Edit Project</button>
            <button
              className="btn-tasks"
              onClick={() => setShowTasks(!showTasks)}
            >
              Tasks
            </button>
          </>
        )}
      </div>

      {/* ---------- Add Task Form ---------- */}
      {showAddTask && (
        <div className="task-form">
          <input
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <div className="task-form-actions">
            <button onClick={addTask}>Add</button>
            <button
              className="cancel-btn"
              onClick={() => {
                setShowAddTask(false);
                setTaskName("");
                setStartDate("");
                setEndDate("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    {/* ---------- Task List ---------- */}
{showTasks && tasks.length > 0 && (
  <div className="task-list">
    {tasks.map((task) => (
      <div key={task._id} className="task-row">
        {editingTaskId === task._id ? (
          <>
            {/* ---------- Inline Edit Inputs ---------- */}
            <input
              value={editTaskName}
              onChange={(e) => setEditTaskName(e.target.value)}
            />
            <input
              type="date"
              value={editStartDate}
              onChange={(e) => setEditStartDate(e.target.value)}
            />
            <input
              type="date"
              value={editEndDate}
              onChange={(e) => setEditEndDate(e.target.value)}
            />

            {/* ---------- Save / Cancel Buttons ---------- */}
            <div className="task-edit-actions">
              <button
                className="save-btn"
                onClick={() => saveTask(task._id)}
              >
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditingTaskId(null)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* ---------- Display Task ---------- */}
            <span>{task.name}</span>
            <div className="task-actions">
              <button onClick={() => startEditTask(task)}>Edit</button>
              <button
                onClick={() => deleteTask(task._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    ))}
  </div>
)}

    </div>
  );
}
