import { useEffect, useState } from "react";
import GanttChart from "./GanttChart";
import "./ProjectCard.css";

const API_PROJECTS = import.meta.env.VITE_API_PROJECTS;

export default function ProjectCard({ project, onDelete, onUpdate, isDemo }) {
  const token = localStorage.getItem("token");

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  const [tasks, setTasks] = useState(project.tasks || []);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");

  useEffect(() => {
    if (isDemo) {
      setTasks(project.tasks || []);
      return;
    }

    const fetchTasks = async () => {
      const res = await fetch(`${API_PROJECTS}/${project._id}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    };
    fetchTasks();
  }, [project._id, token, isDemo]);

  const saveProject = async () => {
    if (isDemo) {
      onUpdate({ ...project, name, description });
      setEditing(false);
      return;
    }

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

  const addTask = async () => {
    if (!taskName.trim()) return;

    if (isDemo) {
      const newTask = {
        _id: Date.now().toString(),
        name: taskName,
        startDate,
        endDate,
      };
      setTasks((prev) => [...prev, newTask]);
      setTaskName("");
      setStartDate("");
      setEndDate("");
      setShowAddTask(false);
      return;
    }

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

  const startEditTask = (task) => {
    setEditingTaskId(task._id);
    setEditTaskName(task.name);
    setEditStartDate(task.startDate?.slice(0, 10) || "");
    setEditEndDate(task.endDate?.slice(0, 10) || "");
  };

  const saveTask = async (taskId) => {
    if (isDemo) {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === taskId
            ? {
                ...t,
                name: editTaskName,
                startDate: editStartDate,
                endDate: editEndDate,
              }
            : t
        )
      );
      setEditingTaskId(null);
      return;
    }

    const res = await fetch(`${API_PROJECTS}/${project._id}/tasks/${taskId}`, {
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
    });

    const updatedTask = await res.json();
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? updatedTask : t))
    );
    setEditingTaskId(null);
  };

  const deleteTask = async (taskId) => {
    if (isDemo) {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      return;
    }

    await fetch(`${API_PROJECTS}/${project._id}/tasks/${taskId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return (
    <div className="project-card">
      {isDemo && (
        <div className="demo-warning">Demo Mode – Changes will not be saved</div>
      )}

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

      {tasks.length > 0 && <GanttChart tasks={tasks} />}

      <div className="project-actions">
        {!showAddTask ? (
          <button className="btn-add" onClick={() => setShowAddTask(true)}>Add Task</button>
        ) : (
          <button className="cancel-btn" onClick={() => setShowAddTask(false)}>Cancel</button>
        )}

        <button className="btn-delete" onClick={() => onDelete(project._id)}>Delete Project</button>

        {tasks.length > 0 && (
          <>
            <button className="btn-edit-main" onClick={() => setEditing(true)}>Edit Project</button>
            {!showTasks ? (
              <button className="btn-tasks" onClick={() => setShowTasks(true)}>Tasks</button>
            ) : (
              <button className="cancel-btn-main" onClick={() => { setShowTasks(false); setEditingTaskId(null); }}>Cancel</button>
            )}
          </>
        )}
      </div>

      {showAddTask && (
        <div className="task-form">
          <input placeholder="Task name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <div className="task-form-actions">
            <button onClick={addTask}>Add</button>
            <button className="cancel-btn" onClick={() => {
              setShowAddTask(false);
              setTaskName("");
              setStartDate("");
              setEndDate("");
            }}>Cancel</button>
          </div>
        </div>
      )}

      {showTasks && tasks.length > 0 && (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-row">
              {editingTaskId === task._id ? (
                <>
                  <input value={editTaskName} onChange={(e) => setEditTaskName(e.target.value)} />
                  <input type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                  <input type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
                  <div className="task-edit-actions">
                    <button className="save-btn" onClick={() => saveTask(task._id)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingTaskId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span>{task.name}</span>
                  <div className="task-actions">
                    <button onClick={() => startEditTask(task)}>Edit</button>
                    <button onClick={() => deleteTask(task._id)} className="btn-delete">Delete</button>
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