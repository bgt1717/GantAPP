import { useEffect, useState } from "react";

const API = "http://localhost:5000";

export default function ProjectCard({ project, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [tasks, setTasks] = useState([]);

  const [taskName, setTaskName] = useState("");
  const [taskStart, setTaskStart] = useState("");
  const [taskEnd, setTaskEnd] = useState("");
  const [error, setError] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editTaskStart, setEditTaskStart] = useState("");
  const [editTaskEnd, setEditTaskEnd] = useState("");

  const token = localStorage.getItem("token");

  /* ---------- FETCH TASKS ---------- */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API}/tasks/${project._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTasks();
  }, [project._id, token]);

  /* ---------- SAVE PROJECT ---------- */
  const handleSaveProject = () => {
    onUpdate(project._id, { name, description });
    setEditing(false);
  };

  /* ---------- ADD TASK ---------- */
  const addTask = async () => {
    if (!taskName || !taskStart || !taskEnd) {
      setError("All task fields are required");
      return;
    }

    try {
      const res = await fetch(`${API}/tasks/${project._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: taskName,
          startDate: `2025-W${taskStart}-1`,
          endDate: `2025-W${taskEnd}-7`,
        }),
      });
      if (!res.ok) throw new Error("Failed to add task");

      const newTask = await res.json();
      setTasks((prev) => [...prev, newTask]);
      setTaskName("");
      setTaskStart("");
      setTaskEnd("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add task");
    }
  };

  /* ---------- DELETE TASK ---------- */
  const deleteTask = async (taskId) => {
    try {
      const res = await fetch(`${API}/tasks/${taskId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- UPDATE TASK ---------- */
  const updateTask = async (taskId) => {
    if (!editTaskName || !editTaskStart || !editTaskEnd) return;

    try {
      const res = await fetch(`${API}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editTaskName,
          startDate: `2025-W${editTaskStart}-1`,
          endDate: `2025-W${editTaskEnd}-7`,
        }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      const updated = await res.json();
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? updated : t))
      );
      setEditingTaskId(null);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- WEEK CALC ---------- */
  const getWeek = (dateStr) => {
    const date = new Date(dateStr);
    const oneJan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(
      ((date - oneJan) / 86400000 + oneJan.getDay() + 1) / 7
    );
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "16px",
        background: "#fff",
      }}
    >
      {/* ---------- EDIT PROJECT ---------- */}
      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleSaveProject}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                background: "#9e9e9e",
                color: "#fff",
                border: "none",
                padding: "8px 14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h3 style={{ margin: "0 0 6px 0" }}>{project.name}</h3>
          {project.description && (
            <p style={{ color: "#555", marginBottom: "10px" }}>
              {project.description}
            </p>
          )}
          <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
            <button
              onClick={() => setEditing(true)}
              style={{
                background: "#ffb300",
                color: "#000",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              style={{
                background: "#e53935",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>

          {/* ---------- ADD TASK ---------- */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <input
              placeholder="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Start Week"
              min="1"
              max="52"
              value={taskStart}
              onChange={(e) => setTaskStart(e.target.value)}
            />
            <input
              type="number"
              placeholder="End Week"
              min="1"
              max="52"
              value={taskEnd}
              onChange={(e) => setTaskEnd(e.target.value)}
            />
            <button
              onClick={addTask}
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              + Add Task
            </button>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* ---------- WEEKLY GANTT ---------- */}
          <div style={{ overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(52, 20px)`,
                gap: "2px",
                marginBottom: "6px",
              }}
            >
              {Array.from({ length: 52 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "10px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            {tasks.map((task) => {
              const startWeek = Math.max(getWeek(task.startDate), 1);
              const endWeek = Math.min(getWeek(task.endDate), 52);
              const barStart = startWeek - 1;
              const barSpan = endWeek - startWeek + 1;

              return (
                <div
                  key={task._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(52, 20px)`,
                    gap: "2px",
                    alignItems: "center",
                    marginBottom: "4px",
                  }}
                >
                  {Array.from({ length: 52 }, (_, i) =>
                    editingTaskId === task._id ? null : (
                      <div
                        key={i}
                        style={{
                          height: "16px",
                          background:
                            i >= barStart && i < barStart + barSpan
                              ? "#1976d2"
                              : "#eee",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        title={`${task.name}: W${startWeek} → W${endWeek}`}
                        onClick={() => {
                          setEditingTaskId(task._id);
                          setEditTaskName(task.name);
                          setEditTaskStart(startWeek);
                          setEditTaskEnd(endWeek);
                        }}
                      />
                    )
                  )}

                  {editingTaskId === task._id && (
                    <>
                      <input
                        type="text"
                        value={editTaskName}
                        onChange={(e) => setEditTaskName(e.target.value)}
                        style={{ width: "100px" }}
                      />
                      <input
                        type="number"
                        value={editTaskStart}
                        min="1"
                        max="52"
                        onChange={(e) => setEditTaskStart(e.target.value)}
                        style={{ width: "60px" }}
                      />
                      <input
                        type="number"
                        value={editTaskEnd}
                        min="1"
                        max="52"
                        onChange={(e) => setEditTaskEnd(e.target.value)}
                        style={{ width: "60px" }}
                      />
                      <button
                        onClick={() => updateTask(task._id)}
                        style={{
                          background: "#1976d2",
                          color: "#fff",
                          border: "none",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        style={{
                          background: "#9e9e9e",
                          color: "#fff",
                          border: "none",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {/* Delete task */}
                  {editingTaskId !== task._id && (
                    <button
                      onClick={() => deleteTask(task._id)}
                      style={{
                        marginLeft: "6px",
                        background: "#e53935",
                        color: "#fff",
                        border: "none",
                        padding: "2px 6px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "10px",
                      }}
                    >
                      X
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

