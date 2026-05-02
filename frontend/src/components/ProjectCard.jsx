export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div>
      <h3>{project.name}</h3>
      <p>{project.description}</p>

      <button onClick={() => onEdit(project)}>Editar</button>
      <button onClick={() => onDelete(project.id)}>Deletar</button>
    </div>
  );
}
