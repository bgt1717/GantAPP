import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

const API = "http://localhost:5000";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(setProjects);
  }, []);

  const addProject = async () => {
    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    const project = await res.json();
    setProjects([...projects, project]);
    setName("");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Projects</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={addProject}>Add Project</button>
      </div>

      {projects.map((p) => (
        <ProjectCard key={p._id} project={p} />
      ))}
    </div>
  );
}
