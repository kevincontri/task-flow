// @ts-ignore
import "./CommentsModal.css";
// @ts-ignore
import "./ProjectModal.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";
import { CommentBase } from "../types/comment_types.ts";

export default function CommentModal({
  onClose,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
  commentError,
}:{
  onClose: () => void;
  comments: CommentBase[];
  newComment: string;
  setNewComment: React.Dispatch<React.SetStateAction<string>>;
  handleAddComment: () => void;
  handleDeleteComment: (id: number) => void;
  commentError: string;
}) {
  const { language } = useContext(LanguageContext);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {language === "en" ? "Notes" : "Notas"}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        {commentError && (
          <div className="modal-error">
            <p>{commentError}</p>
          </div>
        )}
        {comments.length === 0 && (
          <p className="no-comments">
            {language === "en"
              ? "No notes yet. Add one!"
              : "Ainda não há notas. Adicione uma!"}
          </p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="comment">
            <div className="comment-header">
              <div className="comment-date">
                <p>{c.created_at.slice(0, 10)}</p>
              </div>
              <button
                className="btn-delete-comment"
                onClick={() => handleDeleteComment(c.id)}
              >
                {language === "en" ? "Delete" : "Excluir"}
              </button>
            </div>
            <div className="comment-body">
              <p>{c.content}</p>
            </div>
          </div>
        ))}
        <div className="new-comment">
          <textarea
            placeholder={
              language === "en"
                ? "Add a comment..."
                : "Adicione um comentário..."
            }
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }}
          />
          <button
            className="btn-add-comment"
            onClick={() => handleAddComment()}
          >
            {language === "en" ? "Add Note" : "Adicionar Nota"}
          </button>
        </div>
      </div>
    </div>
  );
}
