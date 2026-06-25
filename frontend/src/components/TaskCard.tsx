import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
// @ts-ignore
import "./TaskCard.css";
// @ts-ignore
import commentIcon from "../assets/comment.png";
import { getComments } from "../api/comments.ts";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { TaskBase } from "../types/task_types";
import { useQuery } from "@tanstack/react-query";
import { CommentBase } from "../types/comment_types.ts";

export default function TaskCard({ task, onEdit, onDelete, onOpenComments, commentCount }: { task: TaskBase; onEdit: (task: TaskBase) => void; onDelete: (taskId: number) => void; onOpenComments: (task: TaskBase) => void; commentCount?: number }) {
  
  const { data: comments } = useQuery<CommentBase[]>({
    queryKey: ["comments", task.id],
    queryFn: () => getComments(task.project_id, task.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: commentCount === undefined, // Only fetch if commentCount is not provided
  });

  const { language } = useContext(LanguageContext);
  const commentsCount = commentCount !== undefined ? commentCount : comments?.length || 0;

  // Display-only translation. Never mutate task.priority: it's a reference to
  // the cached task, and the backend only accepts the English enum values.
  const priorityLabel =
    language === "en"
      ? task.priority
      : { high: "alta", medium: "média", low: "baixa" }[task.priority] ?? task.priority;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
      data: { task },
    });

  const style:React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
    opacity: isDragging ? 0 : 1,
    pointerEvents: isDragging ? "none" : undefined,
  };

  const deadline = new Date(task.deadline);
  deadline.setDate(deadline.getDate() + 1);
  const deadlineDate = deadline.toLocaleDateString(
    `${language === "en" ? "en-US" : "pt-BR"}`,
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${task.status === 'done' ? 'task-card-done' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header">
        <h4 className="task-card-title" style={task.status === 'done' ? { textDecoration: 'line-through' } : {}}>
          {task.name}
          </h4>
        {task.status !== "done" && (
          <span className={`priority-badge priority-badge--${task.priority}`}>
            {priorityLabel}
          </span>
        )}
      </div>

      {task.description && <p className="task-card-desc" style={task.status === 'done' ? { textDecoration: 'line-through' } : {}}>
        {task.description}
        </p>}

      <div className="task-card-footer" style={task.status === 'done' ? { textDecoration: 'line-through' } : {}}>
        {task.deadline && (
          <p className="task-card-deadline">
            {language === "en" ? "Deadline: " : "Prazo: "} -{" "}
            <span>{deadlineDate}</span>
          </p>
        )}

        <div onPointerDown={(e) => e.stopPropagation()}>
          <button
            title={language === "en" ? "Open Notes" : "Abrir Anotações"}
            className="btn-task-comment"
            onClick={() => onOpenComments(task)}
          >
            <img
              src={commentIcon}
              alt="Comment"
              className="task-comment-icon"
            />
            {commentsCount > 0 ? <span> {commentsCount} </span> : ""}
          </button>
        </div>
      </div>
      <div
        className="task-card-actions"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          title={language === "en" ? "Edit Task" : "Editar Tarefa"}
          className="btn-task-edit"
          onClick={() => onEdit(task)}
        >
          {language === "en" ? "Edit" : "Editar"}
        </button>
        <button
          title={language === "en" ? "Delete Task" : "Excluir Tarefa"}
          className="btn-task-delete"
          onClick={() => onDelete(task.id)}
        >
          {language === "en" ? "Delete" : "Excluir"}
        </button>
      </div>
    </div>
  );
}
