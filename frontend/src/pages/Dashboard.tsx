import { useState } from "react";
import { useAuth } from "../contexts/AuthContext.tsx";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../api/projects.ts";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
// @ts-ignore
import "./Dashboard.css";
import QuoteModal from "../components/QuoteModal.tsx";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { ProjectBase, ProjectUpdate, ProjectCreate } from "../types/project_types";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function Dashboard() {
  const { language, setLanguage } = useContext(LanguageContext);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectBase | null>(null);
  const [quote, setQuote] = useState(() => {
    return (
      localStorage.getItem("quote") ||
      `${language === "en" ? "Your motivational quote here!" : "Sua citação motivacional aqui!"}`
    );
  });
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  const { logout } = useAuth() as { logout: () => void };

  const queryClient = useQueryClient();
  
  const fetchProjects = async (): Promise<ProjectBase[]> => await getProjects();

  // Fetch projects from server
  const { data: projects = [], isLoading } = useQuery<ProjectBase[]>({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes to stale cache
  });

  const handleEdit = (project: ProjectBase): void => {
    setEditingProject(project);
    setShowModal(true);
  };

  // Project removal
  const { mutate: removeProject, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"]}),
    onError: (err: any) => {
      console.log("Failed to delete project:", err);
      alert("Failed to delete project: " + (err.response?.data?.detail ||err.message));
    }
  });

  const handleDelete = (id: number): void => {
    if (!window.confirm("Deletar projeto?")) return;
    removeProject(id);
  }

  // Project creation
  const { mutate: saveProject, isPending: isSaving } = useMutation({
    mutationFn: (projectData: ProjectCreate | ProjectUpdate) => {
      if (editingProject) {
        return updateProject(editingProject.id, projectData as ProjectUpdate);
      } else {
        return createProject(projectData as ProjectCreate);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["projects"]});
      setShowModal(false);
    },
    onError: (error: any) => {
      console.error("Failed to save project:", error);
      alert(
        "Failed to save project: " +
          (error.response?.data?.detail || error.message),
      );
    },
  });

  const handleNewProject = (): void => {
    setEditingProject(null);
    setShowModal(true);
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
        <div className="language-toggle">
          <span className="language-label-en">EN</span>
          <input
            type="checkbox"
            id="lang-toggle"
            checked={language === "pt"}
            onChange={() => setLanguage(language === "en" ? "pt" : "en")}
          />
          <label htmlFor="lang-toggle" className="button-toggle"></label>
          <span className="language-label-pt">PT</span>
        </div>
        <button className="btn-logout" onClick={logout}>
          {language === "en" ? "Logout" : "Sair"}
        </button>
      </header>

      <main className="dash-main">
        {quote.length > 0 && (
          <div className="dash-quote">
            <span onClick={() => setQuoteModalOpen(true)}>{quote}</span>
          </div>
        )}

        <div className="dash-date">
          <span>
            {new Date().toLocaleDateString(
              language === "en" ? "en-US" : "pt-BR",
            )}
          </span>
        </div>
        <div className="dash-section-header">
          <div>
            <h1 className="dash-title">
              {language === "en" ? "My Projects" : " Meus Projetos"}
            </h1>
            <p className="dash-subtitle">
              {projects.length} {language === "en" ? "project" : "projeto"}
              {projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button className={`btn-new-project ${projects.length == 0 && "btn-jumping-db"}`} onClick={handleNewProject}>
            <span>+</span> {language === "en" ? "New Project" : "Novo Projeto"}
          </button>
        </div>

        {isLoading && (
          <div className="dash-loading">
            <div className="loading-dot" />
            <div className="loading-dot" />
            <div className="loading-dot" />
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="dash-empty">
            <p>
              {language === "en"
                ? "No projects yet. Create your first one!"
                : "Não há projetos ainda. Crie seu primeiro!"}
            </p>
          </div>
        )}

        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      </main>

      {quoteModalOpen && (
        <QuoteModal
          quote={quote}
          setQuote={setQuote}
          onClose={() => {
            setQuoteModalOpen(false);
          }}
          onSave={(newQuote: string) => {
            setQuote(newQuote);
            localStorage.setItem("quote", newQuote);
            setQuoteModalOpen(false);
          }}
        />
      )}
      {showModal && (
        <ProjectModal
          project={editingProject}
          onSave={saveProject}
          onClose={() => setShowModal(false)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
