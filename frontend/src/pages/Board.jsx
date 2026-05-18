import { useState, useEffect } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
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

const STATUSES = ["todo", "in_progress", "done"];

export default function Board() {
  const { projectId } = useParams(); // Get projectId from URL params
  const location = useLocation(); // Get projectName from location state (passed from Dashboard (ProjectCard))
  const projectName = location.state?.projectName || "Project Board";

  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [initialStatus, setInitialStatus] = useState("todo");

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

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

  const handleDelete = async (taskId) => {
    if (!window.confirm("Delete Task?")) return;
    try {
      await deleteTask(projectId, taskId);
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(
        "Failed to delete task: " + (err.response?.data?.detail || err.message),
      );
    }
  };

  const handleSave = async (data) => {
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
  };

  return (
    <div className="board-page">
      <header className="board-navbar">
        <div className="board-nav-left">
          <Link to="/dashboard" className="btn-back">
            ← Dashboard
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
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {tasks.length === 0 && (
            <div className="board-message">
              <p>No tasks yet. Add your first task!</p>
            </div>
          )}

          {tasks.length > 0 && tasks.every((t) => t.status === "done") && (
            <div className="board-message">
              <p>All tasks are done! Great job!</p>
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
