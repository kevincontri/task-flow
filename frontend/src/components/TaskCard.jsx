import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import "./TaskCard.css";

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
    data: { task },
  });

  const style = { transform: CSS.Translate.toString(transform) };

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

      {task.description && (
        <p className="task-card-desc">{task.description}</p>
      )}

      {task.deadline && (
        <p className="task-card-deadline">
          {new Date(task.deadline).toLocaleDateString("pt-BR")}
        </p>
      )}

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
