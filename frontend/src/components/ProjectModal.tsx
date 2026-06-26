import { useState } from "react";
// @ts-ignore
import "./ProjectModal.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { ProjectModalProps } from "../types/project_types";
import { useQueryClient } from "@tanstack/react-query";

export default function ProjectModal({ project, onSave, onClose, isSaving = false }: ProjectModalProps) {
  const { language } = useContext(LanguageContext);
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [err, setError] = useState("");

  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      name.length < 3 ||
      name.length > 32 ||
      description.length < 3 ||
      description.length > 256
    ) {
      setError(
        language === "en"
          ? "Project name must be 3-32 chars and description 3-256 chars"
          : "O nome do projeto deve ter entre 3 e 32 caracteres e a descrição entre 3 e 256 caracteres",
      );
      return;
    }

    if (project) {
      queryClient.setQueryData(["projects"], (oldProjects: any) =>
        oldProjects.map((p: any) =>
          p.id === project.id ? { ...p, name, description } : p,
        ),
      );
    }

    onSave({ name, description });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {project
              ? `${language === "en" ? "Edit Project" : "Editar Projeto"}: ${project.name}`
              : `${language === "en" ? "New Project" : "Novo Projeto"}`}
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
            <label htmlFor="proj-name">
              {language === "en" ? "Name" : "Nome"}
            </label>
            <input
              id="proj-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                language === "en" ? "Project name" : "Nome do projeto"
              }
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="proj-desc">
              {language === "en" ? "Description" : "Descrição"}
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                language === "en"
                  ? "Brief description..."
                  : "Descrição breve..."
              }
              rows={3}
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
            <button type="submit" className="btn-modal-save" disabled={isSaving}>
              { isSaving 
                ? (language === "en" ? "Saving..." : "Salvando...") 
                : (language === "en" ? "Save" : "Salvar") }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
