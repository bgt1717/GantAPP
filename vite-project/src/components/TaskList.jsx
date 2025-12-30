import { useState } from "react";

const API = "http://localhost:5000";

export default function TaskList({ projectId, tasks, setTasks }) {
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const addTask = async () => {
    const res = await fetch(`${API}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        projectId,
        title,
        startDate: start,
        endDate: end,
      }),
    });

    const task = await res.json();
    setTasks([...tasks, task]);

    setTitle("");
    setStart("");
    setEnd("");
  };

  const deleteTask = async (id) => {
    await fetch(`${API}/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div>
      <h4>Tasks</h4>

      {tasks.map(task => (
        <div key={task._id} style={{ marginBottom: 8 }}>
          <strong>{task.title}</strong><br />
          {task.startDate} → {task.endDate}
          <button onClick={() => deleteTask(task._id)}>❌</button>
        </div>
      ))}

      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Task name"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>
    </div>
  );
}
