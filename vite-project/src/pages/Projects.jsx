import { useEffect, useState } from "react";

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

        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }

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

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const newProject = await res.json();

      // ✅ SAFE STATE UPDATE
      setProjects((prev) => [newProject, ...prev]);

      setName("");
      setDescription("");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
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
          <div
            key={project._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "12px",
            }}
          >
            <h3 style={{ margin: 0 }}>{project.name}</h3>
            {project.description && (
              <p style={{ color: "#555" }}>{project.description}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;
