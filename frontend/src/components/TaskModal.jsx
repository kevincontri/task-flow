import { useState } from "react";
import "./ProjectModal.css";

export default function TaskModal({ task, initialStatus, onSave, onClose }) {
  const toDateInput = (iso) => (iso ? iso.slice(0, 10) : "");

  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "low");
  const [deadline, setDeadline] = useState(toDateInput(task?.deadline));
  const [err, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Append UTC midnight so AwareDatetime validation passes on the backend

    const deadlineISO = deadline ? `${deadline}T00:00:00Z` : null;

    if (!deadlineISO) {
      setError("Deadline is required");
      return;
    }

    const target_date = new Date(deadlineISO);
    const now = new Date();

    if (now > target_date) {
      setError("Deadline cannot be in the past");
      return;
    } else if (target_date.getFullYear() > 2100) {
      setError("Invalid deadline date");
      return;
    }

    if (
      name.length < 3 ||
      name.length > 32 ||
      description.length < 3 ||
      description.length > 256
    ) {
      setError(
        "Task title must be between 3 and 32 characters and description between 3 and 256 characters",
      );
      return;
    }
    onSave({ name, description, priority, deadline: deadlineISO });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? "Edit Task" : "New Task"}</h2>
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
            <label htmlFor="task-name">Title</label>
            <input
              id="task-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What needs to be done..."
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="task-deadline">Deadline</label>
            <input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
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
