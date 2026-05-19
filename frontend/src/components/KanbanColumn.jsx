import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import "./KanbanColumn.css";

const columnLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

export default function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onNewTask,
  onOpenComments,
}) {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <div className="kanban-column">
      <div className="column-header">
        <span className="column-label">{columnLabels[status]}</span>
        <span className="column-count">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`column-droppable${isOver ? " column-droppable--over" : ""}`}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onOpenComments={() => onOpenComments(task)}
          />
        ))}
      </div>

      <div className="column-footer">
        <button className="btn-new-task" onClick={() => onNewTask(status)}>
          + New Task
        </button>
      </div>
    </div>
  );
}
