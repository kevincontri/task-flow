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
} from "../api/tasks.ts";
import KanbanColumn from "../components/KanbanColumn.tsx";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
// @ts-ignore
import "./Board.css";
import { getComments, createComment, deleteComment } from "../api/comments.ts";
import CommentsModal from "../components/CommentModal.tsx";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext";
// @ts-ignore
import back from "../assets/arrow.png";
import { TaskBase, TaskCreate, TaskStatus, TaskUpdate } from "../types/task_types";
import { CommentBase, CommentCreate } from "../types/comment_types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];

export default function Board() {
  const { language } = useContext(LanguageContext);
  const { projectId } = useParams(); // Get projectId from URL params
  const location = useLocation(); // Get projectName from location state (passed from Dashboard (ProjectCard))
  const projectName =
    location.state?.projectName ||
    `${language === "en" ? "Project Board" : "Quadro de Projeto"} ${projectId}`;

  const [activeTask, setActiveTask] = useState<TaskBase | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskBase | null>(null);
  const [statusSelected, setStatusSelected] = useState<TaskStatus>("todo");
  const [commentTask, setCommentTask] = useState<TaskBase | null>(null);
  const [newComment, setNewComment] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentCounts, setCommentCounts] = useState<Record<number, number>>({});

  const queryClient = useQueryClient();

  const fetchTasks = async (): Promise<TaskBase[]> => await getTasks(Number(projectId));

  const fetchComments = async ({taskId}: {taskId:number}): Promise<CommentBase[]> => await getComments(Number(projectId), taskId);

  // Fetch tasks from server
  const {data: tasks = [] } = useQuery<TaskBase[]>({
    queryKey: ["tasks", Number(projectId)],
    queryFn: fetchTasks,
    staleTime: 5 * 60 * 1000 // 5 minutes to stale cache
  })

  // Fetch comments from server when a task is selected
  const { data: comments = [] } = useQuery<CommentBase[]>({
    queryKey: ["comments", commentTask?.id],
    queryFn: () => fetchComments({taskId: commentTask!.id}),
    enabled: !!commentTask, // Only fetch comments when a task is selected
    staleTime: 5 * 60 * 1000 // 5 minutes to stale cache
  })

  // Mutations for creating/updating tasks
  const { mutate: saveTaskMutation } = useMutation<TaskBase, any, TaskCreate | TaskUpdate>({
    mutationFn: (taskData: TaskCreate | TaskUpdate) =>{
      if (editingTask) {
        return updateTask(Number(projectId), editingTask.id, taskData as TaskUpdate);
      } else {
        return createTask(Number(projectId), taskData as TaskCreate);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", Number(projectId)] })
      setShowModal(false);
    },
    onError: (err) => {
      console.error("Failed to save task:", err);
      alert(
        `${language === "en" ? "Failed to save task: " : "Falha ao salvar tarefa: "}` +
          (err.response?.data?.detail || err.message),
      );
    }
  });

  // Mutation for moving tasks
  const { mutate: moveTaskMutation, isPending: isMovingTask } = useMutation<TaskBase, any, { taskId: number, newStatus: string}>({
    mutationFn: ({ taskId, newStatus }) => moveTask(Number(projectId), taskId, newStatus),
    onError: (err: any) => {
      console.error("Failed to move task:", err);
      alert(
        `${language === "en" ? "Failed to move task: " : "Falha ao mover tarefa: "}` +
          (err.response?.data?.detail || err.message),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks", Number(projectId)] }),
  });

  // Mutation for deleting tasks
  const { mutate: deleteTaskMutation } = useMutation<void, any, {taskId: number}>({
    mutationFn: ({ taskId }) => deleteTask(Number(projectId), taskId),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ["tasks", Number(projectId)]}),
    onError: (err) => {
      console.error("Failed to delete task:", err);
      alert(
        `${language === "en" ? "Failed to delete task: " : "Falha ao deletar tarefa: "}` +
          (err.response?.data?.detail || err.message),
      );
    },
  });

  // Mutation for adding comments
  const { mutate: commentCreateMutation } = useMutation<CommentBase, any, {taskId: number, comment: string}>({
    mutationFn: ({ taskId, comment }) => createComment(Number(projectId), taskId, comment),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", commentTask?.id]}),
    onError: (err) => {
      console.error("Failed to create comment:", err);
      alert(
        `${language === "en" ? "Failed to create comment: " : "Falha ao criar comentário: "}` +
          (err.response?.data?.detail || err.message),
      );
    }
  })

  // Mutation for deleting comments
  const { mutate: commentDeleteMutation } = useMutation<void, any, {taskId: number, commentId: number}>({
    mutationFn: ({ taskId, commentId }) => deleteComment(Number(projectId), taskId, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["comments", commentTask?.id]}),
    onError: (err) => {
      console.error("Failed to delete comment:", err);
      alert(
        `${language === "en" ? "Failed to delete comment: " : "Falha ao deletar comentário: "}` +
          (err.response?.data?.detail || err.message),
      );
    }
  })

  // Filter tasks by status to properly send it to the KanbanColumn
  const getTasksByStatus = (status: string) => tasks.filter((t) => t.status === status);

  // @dnd-kit trigger event for drag start, setting the current task as the active one
  const handleDragStart = (event: any) => {
    setActiveTask(event.active.data.current.task);
  };

  // @dnd-kit trigger event for drag end. We can get the current task and where it's standing.
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveTask(null); // Reinitiate active task since now we have it in 'active' variable
    if (!over) return;

    const taskId = active.id; // taskId is stored in active.id because we set it in useDraggable data
    const newStatus = over.id; // over.id is the id of the KanbanColumn which is the new status
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Optimistically move the card synchronously, in the same render flush as
    // setActiveTask(null), so it lands in the new column without flashing back.
    queryClient.setQueryData<TaskBase[]>(["tasks", Number(projectId)], (old) =>
      old?.map((t) => (t.id === taskId ? { ...t, status: newStatus as TaskBase["status"] } : t)),
    );

    moveTaskMutation({ taskId, newStatus });
  };

  const handleNewTask = (status: TaskStatus) => {
    setEditingTask(null);
    setStatusSelected(status);
    setShowModal(true);
  };

  const handleEdit = (task: TaskBase) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleOpenComments = async (task: TaskBase) => {
    setCommentTask(task);
    setCommentCounts((prev) => ({ ...prev, [task.id]: comments.length }));
    setShowCommentsModal(true);
  };

  const handleAddComment = async () => {
    // Validate comment
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

    // Reset error message before attempting to create comment
    setCommentError("");

    if (!commentTask) return;

    commentCreateMutation(
      { taskId: commentTask.id, comment: newComment }
    );

    setCommentCounts((prev) => ({
      ...prev,
      [commentTask.id]: (prev[commentTask.id] ?? 0) + 1,
    }));

    setNewComment("");
  };

  const handleDeleteComment = async (commentId: number) => {
    if (
      !window.confirm(
        `${language === "en" ? "Delete Comment?" : "Excluir Comentário?"}`,
      )
    )
      return;

    if (!commentTask) return;

    commentDeleteMutation({ taskId: commentTask.id, commentId });

    setCommentCounts((prev) => ({
      ...prev,
      [commentTask.id]: Math.max(0, (prev[commentTask.id] ?? 1) - 1),
    }));
  };

  const handleDelete = async (task: TaskBase) => {
    if (
      !window.confirm(
        `${language === "en" ? "Delete Task?" : "Excluir Tarefa?"}`,
      )
    )
      return;
    deleteTaskMutation({ taskId: task.id });
  };

  const handleSave = async (data: TaskCreate | TaskUpdate) => {
    try {
      if (editingTask) {
        saveTaskMutation({ ...editingTask, ...data });
      } else {
        saveTaskMutation({ ...data, status: statusSelected });
      }
      setShowModal(false);
      setStatusSelected("todo");
    } catch (err: any) {
      console.error("Failed to save task:", err);
      alert(
        `${language === "en" ? "Failed to save task: " : "Falha ao salvar tarefa: "}` +
          (err.response?.data?.detail || err.message),
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
        
        {/* Loading animation when moving tasks */}
        {isMovingTask && (
        <div className="board-loading">
          <div className="board-loading-dot" />
          <div className="board-loading-dot" />
          <div className="board-loading-dot" />
        </div>
        )}

          <div className="board-columns">
            {STATUSES.map((status: TaskStatus) => (
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
                onOpenComments={() => {}}
                commentCount={0}
              />
            )}
          </DragOverlay>
        </DndContext>
      </main>

      {showCommentsModal && (
        <CommentsModal
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
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}

    </div>
  );
}
