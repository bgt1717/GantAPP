import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Link must be imported here
import ProjectCard from "../components/ProjectCard";
import "./Projects.css";

const API_PROJECTS = import.meta.env.VITE_API_PROJECTS;

export default function Projects({ isDemo }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddProject, setShowAddProject] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    if (isDemo) {
      setProjects([
        {
          _id: "demo-1",
          name: "Website Redesign",
          description: "Marketing site rebuild",
          tasks: [
            {
              _id: "t1",
              name: "Planning",
              startDate: "2026-03-01",
              endDate: "2026-03-05",
            },
            {
              _id: "t2",
              name: "Development",
              startDate: "2026-03-06",
              endDate: "2026-03-20",
            },
          ],
        },
      ]);
      setLoading(false);
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch(API_PROJECTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
  }, [token, isDemo]);

  const addProject = async () => {
    if (!newName.trim()) return;

    if (isDemo) {
      const demoProject = {
        _id: Date.now().toString(),
        name: newName,
        description: newDescription,
        tasks: [],
      };

      setProjects((prev) => [demoProject, ...prev]);
      setNewName("");
      setNewDescription("");
      setShowAddProject(false);
      return;
    }

    try {
      const res = await fetch(API_PROJECTS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });

      if (!res.ok) throw new Error("Failed to create project");
      const createdProject = await res.json();

      setProjects((prev) => [createdProject, ...prev]);
      setNewName("");
      setNewDescription("");
      setShowAddProject(false);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    }
  };

  const updateProject = async (updatedProject) => {
    if (isDemo) {
      setProjects((prev) =>
        prev.map((p) =>
          p._id === updatedProject._id ? updatedProject : p
        )
      );
      return;
    }

    try {
      const res = await fetch(`${API_PROJECTS}/${updatedProject._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedProject.name,
          description: updatedProject.description,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      const updated = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const deleteProject = async (id) => {
    if (isDemo) {
      setProjects((prev) => prev.filter((p) => p._id !== id));
      return;
    }

    try {
      const res = await fetch(`${API_PROJECTS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
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
      {isDemo && (
  <div className="demo-banner">
    <span>Demo Mode – Your work will not be saved.</span>
    {/* <button
      className="demo-register-button"
      onClick={() => {
        onLogout();        // call App.jsx logout
        navigate("/register"); // redirect to register page
      }}
    >
      Create Free Account
    </button> */}
  </div>
)}
      <button
        className="add-project"
        onClick={() => setShowAddProject(!showAddProject)}
      >
        + Add Project
      </button>

      {showAddProject && (
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

          <div className="add-project-actions">
            <button className="btn-add" onClick={addProject}>
              Add
            </button>

            <button
              className="btn-cancel"
              onClick={() => {
                setShowAddProject(false);
                setNewName("");
                setNewDescription("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onDelete={deleteProject}
            onUpdate={updateProject}
            isDemo={isDemo}
          />
        ))
      )}
    </div>
  );
}