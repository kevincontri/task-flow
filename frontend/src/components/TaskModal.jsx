import { useState } from "react";
import "./ProjectModal.css";

export default function TaskModal({ task, initialStatus, onSave, onClose }) {
  const toDateInput = (iso) => (iso ? iso.slice(0, 10) : "");

  const [name, setName] = useState(task?.name || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState(task?.priority || "low");
  const [deadline, setDeadline] = useState(toDateInput(task?.deadline));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Append UTC midnight so AwareDatetime validation passes on the backend
    const deadlineISO = deadline ? `${deadline}T00:00:00Z` : null;
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
              rows={3}
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
