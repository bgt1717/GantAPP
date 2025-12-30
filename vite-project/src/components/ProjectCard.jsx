import { useEffect, useState } from "react";
import TaskList from "./TaskList";

const API = "http://localhost:5000";

export default function ProjectCard({ project }) {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API}/tasks/${project._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setTasks);
  }, []);

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: 20,
      marginBottom: 20,
      borderRadius: 10
    }}>
      <h2>{project.name}</h2>

      <TaskList
        projectId={project._id}
        tasks={tasks}
        setTasks={setTasks}
      />
    </div>
  );
}
