import { useState } from "react";

export default function ProjectModal({ project, onSave, onClose }) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({ name, description });
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          margin: "10% auto",
          maxWidth: "400px",
        }}
      >
        <h2>{project ? "Editar Projeto" : "Novo Projeto"}</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit">Salvar</button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
