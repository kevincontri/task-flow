import { useNavigate } from "react-router-dom";
// @ts-ignore
import "./ProjectCard.css";
import { getTasks } from "../api/tasks.ts";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { ProjectCardProps } from "../types/project_types";
import { useQuery } from "@tanstack/react-query";

export default function ProjectCard({ project, onEdit, onDelete, isDeleting }: ProjectCardProps) {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const { data: tasks, isError } = useQuery({
    queryKey: ["tasks", project.id],
    queryFn: () => getTasks(project.id),
    enabled: !project._optimistic, // Disable fetching if the project is in an optimistic state
    staleTime: 5 * 60 * 1000, // 1 minute to stale cache
  });
  

  if (isError) {
    console.error("Failed to fetch tasks count for project:", project.id);
  }

  const tasksCount = tasks?.length || -1;

  return (
    <div className={`project-card ${project._optimistic ? 'disabled' : ''}`}>
      <div
        className="project-card-body"
        onClick={() => {
          navigate(`/board/${project.id}`, { state: { projectName: project.name } });
}}
      >
        <div className="project-header">
          <div>
            <p>
              {language === "en" ? "Created: " : "Criado:"}{" "}
              {new Date(project.created_at).toLocaleDateString(
                language === "en" ? "en-US" : "pt-BR"
              )}
            </p>
          </div>
          <div>
            <p>
              <span>{language === "en" ? "Tasks: " : "Tarefas: "} {tasksCount >= 0 ? tasksCount : "0"}</span>
            </p>
          </div>
        </div>
        <h3 className="project-card-name">{project.name}</h3>
        <p className="project-card-desc">{project.description}</p>
      </div>

      <div className="project-card-footer">
        <button 
        className="btn-card-edit" 
        onClick={() => {
          onEdit(project)
          }}
        disabled={ isDeleting }
        >
          {language === "en" ? "Edit" : "Editar"}
        </button>
        <button
          className="btn-card-delete"
          onClick={() => {
            onDelete(project.id)
          }}
          disabled={ isDeleting }
        >
          {(language === "en" ? "Delete" : "Excluir")}
        </button>
      </div>
    </div>
  );
}
