import { createContext, useState, useEffect } from "react";

const LanguageContext = createContext<{
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}>({
  language: "en",
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const lang = navigator.language;
  const defaultLang = lang.startsWith("pt") ? "pt" : "en";

  const [language, setLanguage] = useState<string>(
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
