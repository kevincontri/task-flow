// @ts-ignore
import "./ProjectModal.css";
// @ts-ignore
import "./QuoteModal.css";
import { useContext } from "react";
import LanguageContext from "../contexts/LanguageContext.tsx";

export default function QuoteModal({ quote, setQuote, onClose, onSave }: {quote: string; setQuote: (quote: string) => void; onClose: () => void; onSave: (quote: string) => void}) {
  const { language } = useContext(LanguageContext);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {language === "en" ? "Edit Quote" : "Editar Citação"}
          </h2>
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
              placeholder={
                language === "en"
                  ? "Enter your daily quote (256 chars max)"
                  : "Digite sua citação diária (máx. 256 caracteres)"
              }
            />
            <button onClick={() => onSave(quote)}>
              {language === "en" ? "Save" : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
