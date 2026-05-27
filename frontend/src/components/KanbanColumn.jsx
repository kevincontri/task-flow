import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import "./KanbanColumn.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext";

export default function KanbanColumn({
  status,
  tasks,
  onEdit,
  onDelete,
  onNewTask,
  onOpenComments,
  taskLength,
}) {
  const { language } = useContext(LanguageContext);
  const { isOver, setNodeRef } = useDroppable({ id: status });

  const columnLabels = {
    todo: `${language === "en" ? "To Do" : "A Fazer"}`,
    in_progress: `${language === "en" ? "In Progress" : "Em Progresso"}`,
    done: `${language === "en" ? "Done" : "Concluído"}`,
  };

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
        <button
          className={`btn-new-task ${taskLength == 0 && status == "todo" ? "btn-jumping-kc" : ""}`}
          onClick={() => onNewTask(status)}
        >
          + {language === "en" ? "New Task" : "Nova Tarefa"}
        </button>
      </div>
    </div>
  );
}
