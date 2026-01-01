import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

const API = "http://localhost:5000/api/projects";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(API, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Fetch failed");

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

  /* ================= ADD PROJECT ================= */
  const addProject = async () => {
    if (!name.trim()) return;

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) throw new Error("Create failed");

      const newProject = await res.json();
      setProjects((prev) => [newProject, ...prev]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    }
  };

  /* ================= DELETE PROJECT ================= */
  const deleteProject = async (id) => {
    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete project");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h2>Your Projects</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* ADD PROJECT */}
      <div
        style={{
          background: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />

        <button
          onClick={addProject}
          style={{
            background: "#1976d2",
            color: "#fff",
            border: "none",
            padding: "10px 16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          + Add Project
        </button>
      </div>

      {/* PROJECT LIST */}
      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onDelete={deleteProject}
          />
        ))
      )}
    </div>
  );
}

export default Projects;
