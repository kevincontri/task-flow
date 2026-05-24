import "./CommentsModal.css";
import "./ProjectModal.css";

export default function CommentModal({
  onClose,
  comments,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
  commentError,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Notes</h3>
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
          <p className="no-comments">No notes yet. Add one!</p>
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
                Delete
              </button>
            </div>
            <div className="comment-body">
              <p>{c.content}</p>
            </div>
          </div>
        ))}
        <div className="new-comment">
          <textarea
            placeholder="Add a comment..."
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
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}
