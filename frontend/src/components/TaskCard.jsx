import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import "./TaskCard.css";
import commentIcon from "../assets/comment.png";
import { getComments } from "../api/comments";
import { useState, useEffect } from "react";

export default function TaskCard({ task, onEdit, onDelete, onOpenComments }) {
  const [commentsCount, setCommentsCount] = useState(0);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = { transform: CSS.Translate.toString(transform) };

  const deadline = new Date(task.deadline);
  deadline.setDate(deadline.getDate() + 1);
  const deadlineDate = deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const fetchCommentsLength = async () => {
    const comments = await getComments(task.project_id, task.id);
    console.log("Comments length:", comments.length);
    setCommentsCount(comments.length);
  };

  useEffect(() => {
    fetchCommentsLength();
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
            Deadline - <span>{deadlineDate}</span>
          </p>
        )}

        <div onPointerDown={(e) => e.stopPropagation()}>
          <button
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
        <button className="btn-task-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-task-delete" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
