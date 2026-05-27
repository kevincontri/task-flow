import { createContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const lang = navigator.language || navigator.userLanguage;
  const defaultLang = lang.startsWith("pt") ? "pt" : "en";

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || defaultLang
  );

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
