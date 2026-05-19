import { useNavigate } from "react-router-dom";
import "./ProjectCard.css";
import { getTasks } from "../api/tasks";
import { useState, useEffect } from "react";

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();

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
              Created:{" "}
              {new Date(project.created_at).toLocaleDateString("en-US")}
            </p>
          </div>
          <div>
            <p>
              <span>Tasks: {tasksCount >= 0 ? tasksCount : "Loading..."}</span>
            </p>
          </div>
        </div>
        <h3 className="project-card-name">{project.name}</h3>
        <p className="project-card-desc">{project.description}</p>
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
