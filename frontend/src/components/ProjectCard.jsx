import { useNavigate } from "react-router-dom";
import "./ProjectCard.css";
import { getTasks } from "../api/tasks";
import { useState, useEffect } from "react";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  const handleFetchTasksCount = async () => {
    try {
      const tasks = await getTasks(project.id);
      return tasks.length;
    } catch (err) {
      console.error("Failed to fetch tasks count:", err);
      return -1; // Indicate error
    }
  };

  const [tasksCount, setTasksCount] = useState(-1);

  useEffect(() => {
    const fetchTasksCount = async () => {
      const count = await handleFetchTasksCount();
      setTasksCount(count);
    };
    fetchTasksCount();
  }, [project.id]);

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
        >
          {language === "en" ? "Delete" : "Excluir"}
        </button>
      </div>
    </div>
  );
}
