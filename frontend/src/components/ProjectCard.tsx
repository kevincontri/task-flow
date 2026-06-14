import { useNavigate } from "react-router-dom";
// @ts-ignore
import "./ProjectCard.css";
import { getTasks } from "../api/tasks";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext";
import { ProjectCardProps } from "../types/project_types";
import { useQuery } from "@tanstack/react-query";

export default function ProjectCard({ project, onEdit, onDelete, isDeleting }: ProjectCardProps) {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const { data: tasks, isError } = useQuery({
    queryKey: ["tasks", project.id],
    queryFn: () => getTasks(project.id),
    staleTime: 5 * 60 * 1000, // 5 minutes to stale cache
  });

  if (isError) {
    console.error("Failed to fetch tasks count for project:", project.id);
  }

  const tasksCount = tasks?.length || -1;

  return (
    <div className="project-card">
      <div
        className="project-card-body"
        onClick={() =>
          navigate(`/board/${project.id}`, {
            state: { projectName: project.name }, // Pass project name for header display in Board.jsx
          })
        }
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
              <span>{language === "en" ? "Tasks: " : "Tarefas: "} {tasksCount >= 0 ? tasksCount : "Loading..."}</span>
            </p>
          </div>
        </div>
        <h3 className="project-card-name">{project.name}</h3>
        <p className="project-card-desc">{project.description}</p>
      </div>

      <div className="project-card-footer">
        <button className="btn-card-edit" onClick={() => onEdit(project)}>
          {language === "en" ? "Edit" : "Editar"}
        </button>
        <button
          className="btn-card-delete"
          onClick={() => onDelete(project.id)}
          disabled={isDeleting}
        >
        {isDeleting ? (language === "en" ? "Deleting..." : "Excluindo...") : (language === "en" ? "Delete" : "Excluir")}
        </button>
      </div>
    </div>
  );
}
