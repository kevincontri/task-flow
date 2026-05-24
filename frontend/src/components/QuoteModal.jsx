import "./ProjectModal.css";
import "./QuoteModal.css";

export default function QuoteModal({ quote, setQuote, onClose, onSave }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Edit Quote</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>{quote}</p>
          <div className="field-group-quote">
            <input
              type="text"
              value={quote}
              maxLength={256}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter your daily quote (256 chars max)"
            />
            <button onClick={() => onSave(quote)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
