import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import enTranslations from "../locales/en.json";
import arTranslations from "../locales/ar.json";

export type Language = "en" | "ar";

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
  undefined
);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from localStorage or default to English
    const savedLang = localStorage.getItem("language") as Language;
    return savedLang && ["en", "ar"].includes(savedLang) ? savedLang : "en";
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem("language", language);

    // Update document language
    document.documentElement.lang = language;

    // Add language-specific CSS class to body
    document.body.className = document.body.className.replace(/lang-\w+/g, "");
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let translation: any = language === "en" ? enTranslations : arTranslations;

    for (const k of keys) {
      if (translation && typeof translation === "object" && k in translation) {
        translation = translation[k];
      } else {
        // Fallback to English if translation not found
        let fallbackTranslation: any = enTranslations;
        for (const fallbackKey of keys) {
          if (
            fallbackTranslation &&
            typeof fallbackTranslation === "object" &&
            fallbackKey in fallbackTranslation
          ) {
            fallbackTranslation = fallbackTranslation[fallbackKey];
          } else {
            return key; // Return the key if no translation found
          }
        }
        return fallbackTranslation;
      }
    }

    return typeof translation === "string" ? translation : key;
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): TranslationContextType => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
