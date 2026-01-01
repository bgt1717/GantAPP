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
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "16px",
        background: "#fff",
        color: "#222", // ✅ FIX
      }}
    >
      {editing ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "8px",
              color: "#222",
            }}
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "10px",
              color: "#222",
            }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <button>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <h3 style={{ marginBottom: "6px" }}>{project.name}</h3>

          {project.description && (
            <p style={{ color: "#555" }}>{project.description}</p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button onClick={() => onDelete(project._id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}
