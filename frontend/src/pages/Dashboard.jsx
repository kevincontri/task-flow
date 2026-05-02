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

    await deleteProject(id);
    setProjects(projects.filter((p) => p.id !== id));
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
    <div>
      <div>
        <h1>Meus Projetos</h1>
        <button onClick={logout}>Sair</button>
        <button onClick={handleNewProject}> + Novo Projeto </button>
      </div>

      {loading && <p>Carregando...</p>}

      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

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
