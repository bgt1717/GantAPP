import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import "./Projects.css";

const API = "http://localhost:5000/api/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(API, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Could not load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const addProject = async () => {
    if (!newName.trim()) return;
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const createdProject = await res.json();
      setProjects((prev) => [createdProject, ...prev]);
      setNewName("");
      setNewDescription("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    }
  };

  const updateProject = async (updatedProject) => {
    try {
      const res = await fetch(`${API}/${updatedProject._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: updatedProject.name, description: updatedProject.description }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete project");
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div className="projects-container">
      <h2>Your Projects</h2>
      {error && <p className="error">{error}</p>}

      {/* Add Project Form */}
      <div className="add-project-form">
        <input
          placeholder="Project name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={addProject}>+ Add Project</button>
      </div>

      {/* Project List */}
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onDelete={deleteProject}
            onUpdate={updateProject}
          />
        ))
      )}
    </div>
  );
}
