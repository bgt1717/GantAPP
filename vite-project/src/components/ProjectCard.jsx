import { useState } from "react";

export default function ProjectCard({ project, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");

  const handleSave = () => {
    onUpdate(project._id, { name, description });
    setEditing(false);
  };

  return (
    <div
      style={{
        background: "#fff",
        color: "#222",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "16px",
        marginBottom: "16px",
      }}
    >
      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3>{project.name}</h3>
          {project.description && <p>{project.description}</p>}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(project._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
