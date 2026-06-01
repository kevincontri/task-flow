import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../api/tasks";
import KanbanColumn from "../components/KanbanColumn";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import "./Board.css";
import { getComments, createComment, deleteComment } from "../api/comments";
import CommentsModal from "../components/CommentModal";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext";
import back from "../assets/arrow.png";

const STATUSES = ["todo", "in_progress", "done"];

export default function Board() {
  const { language } = useContext(LanguageContext);
  const { projectId } = useParams(); // Get projectId from URL params
  const location = useLocation(); // Get projectName from location state (passed from Dashboard (ProjectCard))
  const projectName =
    location.state?.projectName ||
    `${language === "en" ? "Project Board" : "Quadro de Projeto"} ${projectId}`;

  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialStatus, setInitialStatus] = useState("todo");

  const [commentTask, setCommentTask] = useState(null);
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentCounts, setCommentCounts] = useState({});

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  useEffect(() => {
    if (activeTask) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [activeTask]);

  const fetchTasks = async () => {
    const data = await getTasks(projectId);
    setTasks(data);
  };

  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event) => {
    setActiveTask(event.active.data.current.task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;
    const task = tasks.find((t) => t.id === taskId);

    if (task.status === newStatus) return;

    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );

    try {
      await moveTask(projectId, taskId, newStatus);
    } catch {
      fetchTasks();
    }
  };

  const handleNewTask = (status) => {
    setEditingTask(null);
    setInitialStatus(status);
    setShowModal(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleOpenComments = async (task) => {
    const data = await getComments(task.project_id, task.id);
    setComments(data);
    setCommentTask(task);
    setCommentCounts((prev) => ({ ...prev, [task.id]: data.length }));
    setShowCommentsModal(true);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      setCommentError(
        `${language === "en" ? "Comment cannot be empty." : "O comentário não pode estar vazio."}`,
      );
      return;
    } else if (newComment.length < 3 || newComment.length > 256) {
      setCommentError(
        `${language === "en" ? "Comment must be between 3 and 256 characters." : "O comentário deve ter entre 3 e 256 caracteres."}`,
      );
      return;
    }

    setCommentError("");

    const comment = await createComment(
      commentTask.project_id,
      commentTask.id,
      newComment,
    );

    setComments((prev) => [...prev, comment]);
    setCommentCounts((prev) => ({
      ...prev,
      [commentTask.id]: (prev[commentTask.id] ?? 0) + 1,
    }));
    setNewComment("");
  };

  const handleDeleteComment = async (commentId) => {
    if (
      !window.confirm(
        `${language === "en" ? "Delete Comment?" : "Excluir Comentário?"}`,
      )
    )
      return;
    await deleteComment(commentTask.project_id, commentTask.id, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setCommentCounts((prev) => ({
      ...prev,
      [commentTask.id]: Math.max(0, (prev[commentTask.id] ?? 1) - 1),
    }));
  };

  const handleDelete = async (taskId) => {
    if (
      !window.confirm(
        `${language === "en" ? "Delete Task?" : "Excluir Tarefa?"}`,
      )
    )
      return;
    try {
      await deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(
        `${language === "en" ? "Failed to delete task: " : "Falha ao excluir tarefa: "}` +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingTask) {
        const updated = await updateTask(projectId, editingTask.id, data);
        setTasks(tasks.map((t) => (t.id === editingTask.id ? updated : t)));
      } else {
        const created = await createTask(projectId, {
          ...data,
          status: initialStatus,
        });
        setTasks([...tasks, created]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save task:", err);
      alert(
        err?.response?.data?.detail ||
          "Failed to save task. Check console for details.",
      );
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
  );

  return (
    <div className="board-page">
      <header className="board-navbar">
        <div className="board-nav-left">
          <Link to="/dashboard" className="btn-back">
            <img src={back} alt="Voltar" />
            <span>{language === "en" ? "Projects" : "Projetos"}</span>
          </Link>
          <div className="board-brand">
            <div className="board-brand-icon">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
                <path
                  d="M6 16 L13 23 L26 9"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="board-brand-name">TaskFlow</span>
          </div>
        </div>
        <span className="board-project-name">{projectName}</span>
      </header>

      <main className="board-main">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {tasks.length === 0 && (
            <div className="board-message">
              <p>
                {language === "en"
                  ? "No tasks yet. Add your first task!"
                  : "Nenhuma tarefa ainda. Adicione sua primeira tarefa!"}
              </p>
            </div>
          )}

          {tasks.length > 0 && tasks.every((t) => t.status === "done") && (
            <div className="board-message">
              <p>
                {language === "en"
                  ? "All tasks are done! Great job!"
                  : "Todas as tarefas estão concluídas! Bom trabalho!"}
              </p>
            </div>
          )}

          <div className="board-columns">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={getTasksByStatus(status)}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onNewTask={handleNewTask}
                onOpenComments={handleOpenComments}
                taskLength={tasks.length}
                commentCounts={commentCounts}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {showCommentsModal && (
        <CommentsModal
          task={commentTask}
          onClose={() => setShowCommentsModal(false)}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
          commentError={commentError}
        />
      )}

      {showModal && (
        <TaskModal
          task={editingTask}
          initialStatus={initialStatus}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
