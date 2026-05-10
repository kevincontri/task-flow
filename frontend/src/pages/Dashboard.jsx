import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import "./Dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const { logout } = useAuth();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.log("Erro ao buscar projetos", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deletar projeto?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert(
        "Failed to delete project: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleSave = async (data) => {
    if (editingProject) {
      const updated = await updateProject(editingProject.id, data);
      setProjects(
        projects.map((p) => (p.id === editingProject.id ? updated : p)),
      );
    } else {
      const created = await createProject(data);
      setProjects([...projects, created]);
    }
    setShowModal(false);
  };

  return (
    <div className="dashboard-page">
      <header className="dash-navbar">
        <div className="dash-brand">
          <div className="dash-brand-icon">
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path
                d="M6 16 L13 23 L26 9"
                stroke="white"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="dash-brand-name">TaskFlow</span>
        </div>
        <button className="btn-logout" onClick={logout}>
          Sign Out
        </button>
      </header>

      <main className="dash-main">
        <div className="dash-section-header">
          <div>
            <h1 className="dash-title">My Projects</h1>
            <p className="dash-subtitle">
              {projects.length} project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className="btn-new-project" onClick={handleNewProject}>
            <span>+</span> New Project
          </button>
        </div>

        {loading && (
          <div className="dash-loading">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}

        {!loading && projects.length === 0 && (
          <div className="dash-empty">
            <p>No projects yet. Create your first one!</p>
          </div>
        )}

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </main>

      {showModal && (
        <ProjectModal
          project={editingProject}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
