import { useState } from "react";

function Projects({ token }) {
  const [name, setName] = useState("");

  const addProject = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 REQUIRED
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create project");
      }

      console.log("Project created:", data);
      setName("");
    } catch (err) {
      console.error("Server error:", err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Projects</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project name"
      />

      <button onClick={addProject}>Add Project</button>
    </div>
  );
}

export default Projects;
