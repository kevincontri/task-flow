import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
// @ts-ignore
import "./TaskCard.css";
// @ts-ignore
import commentIcon from "../assets/comment.png";
import { getComments } from "../api/comments.ts";
import { useState, useEffect } from "react";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { TaskBase } from "../types/task_types";

export default function TaskCard({ task, onEdit, onDelete, onOpenComments, commentCount }: { task: TaskBase; onEdit: (task: TaskBase) => void; onDelete: (taskId: number) => void; onOpenComments: (task: TaskBase) => void; commentCount?: number }) {
  const { language } = useContext(LanguageContext);
  const [fetchedCount, setFetchedCount] = useState(0);
  const commentsCount = commentCount !== undefined ? commentCount : fetchedCount;

  if (task.priority === "high") {
    task.priority = language === "en" ? "high" : "alta";
  } else if (task.priority === "medium") {
    task.priority = language === "en" ? "medium" : "média";
  } else if (task.priority === "low") {
    task.priority = language === "en" ? "low" : "baixa";
  }

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

  const fetchCommentsLength = async () => {
    const comments = await getComments(task.project_id, task.id);
    setFetchedCount(comments.length);
  };

  useEffect(() => {
    if (commentCount === undefined) fetchCommentsLength();
  }, [task.id]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      {...attributes}
      {...listeners}
    >
      <div className="task-card-header">
        <h4 className="task-card-title">{task.name}</h4>
        <span className={`priority-badge priority-badge--${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.description && <p className="task-card-desc">{task.description}</p>}

      <div className="task-card-footer">
        {task.deadline && (
          <p className="task-card-deadline">
            {language === "en" ? "Deadline: " : "Prazo: "} -{" "}
            <span>{deadlineDate}</span>
          </p>
        )}

        <div onPointerDown={(e) => e.stopPropagation()}>
          <button
            title="Open Notes"
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
          title="Edit Task"
          className="btn-task-edit"
          onClick={() => onEdit(task)}
        >
          {language === "en" ? "Edit" : "Editar"}
        </button>
        <button
          title="Delete Task"
          className="btn-task-delete"
          onClick={() => onDelete(task.id)}
        >
          {language === "en" ? "Delete" : "Excluir"}
        </button>
      </div>
    </div>
  );
}
