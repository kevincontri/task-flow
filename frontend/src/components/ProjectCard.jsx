import { useNavigate } from "react-router-dom";
import "./ProjectCard.css";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="project-card">
      <div
        className="project-card-body"
        onClick={() =>
          navigate(`/board/${project.id}`, {
            state: { projectName: project.name },
          })
        }
      >
        <h3 className="project-card-name">{project.name}</h3>
        <p className="project-card-desc">
          {project.description || "No description"}
        </p>
      </div>

      <div className="project-card-footer">
        <button className="btn-card-edit" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button
          className="btn-card-delete"
          onClick={() => onDelete(project.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
