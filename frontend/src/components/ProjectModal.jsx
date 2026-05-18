import { useState } from "react";
import "./ProjectModal.css";

export default function ProjectModal({ project, onSave, onClose }) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [err, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      name.length < 3 ||
      name.length > 32 ||
      description.length < 3 ||
      description.length > 256
    ) {
      setError("Project name must be 3-32 chars and description 3-256 chars");
      return;
    }

    onSave({ name, description });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {project ? `Edit Project: ${project.name}` : "New Project"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {err && (
          <div className="modal-error">
            <p>{err}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="field-group">
            <label htmlFor="proj-name">Name</label>
            <input
              id="proj-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project name"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="proj-desc">Description</label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn-modal-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
