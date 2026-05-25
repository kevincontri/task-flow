import { useState } from "react";
import "./ProjectModal.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext";

export default function TaskModal({ task, initialStatus, onSave, onClose }) {
  const { language } = useContext(LanguageContext);
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
      setError(language === "en" ? "Deadline is required" : "Prazo é obrigatório");
      return;
    }

    const target_date = new Date(deadlineISO);
    const now = new Date();

    if (now > target_date) {
      setError(language === "en" ? "Deadline cannot be in the past" : "Prazo não pode estar no passado");
      return;
    } else if (target_date.getFullYear() > 2100) {
      setError(language === "en" ? "Invalid deadline date" : "Data de prazo inválida");
      return;
    }

    if (
      name.length < 3 ||
      name.length > 32 ||
      description.length < 3 ||
      description.length > 256
    ) {
      setError(
        language === "en"
          ? "Task title must be between 3 and 32 characters and description between 3 and 256 characters"
          : "O título da tarefa deve ter entre 3 e 32 caracteres e a descrição entre 3 e 256 caracteres"
      );
      return;
    }
    onSave({ name, description, priority, deadline: deadlineISO });
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">{task ? `${language === "en" ? "Edit Task" : "Editar Tarefa"}` : `${language === "en" ? "New Task" : "Nova Tarefa"}`}</h2>
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
              <label htmlFor="task-name">{language === "en" ? "Title" : "Título"}</label>
              <input
                id="task-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === "en" ? "Task title" : "Título da tarefa"}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="task-desc">{language === "en" ? "Description" : "Descrição"}</label>
              <textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={language === "en" ? "What needs to be done..." : "O que precisa ser feito..."}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="task-priority">{language === "en" ? "Priority" : "Prioridade"}</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">{language === "en" ? "Low" : "Baixa"}</option>
                <option value="medium">{language === "en" ? "Medium" : "Média"}</option>
                <option value="high">{language === "en" ? "High" : "Alta"}</option>
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="task-deadline">{language === "en" ? "Deadline" : "Prazo"}</label>
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
                {language === "en" ? "Cancel" : "Cancelar"}
              </button>
              <button type="submit" className="btn-modal-save">
                {language === "en" ? "Save" : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
