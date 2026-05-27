import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  translations,
  type Language,
  type TranslationKey,
} from "./translations";

type Replacements = Record<string, string | number>;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: Replacements) => string;
};

const STORAGE_KEY = "music-finder-language";
const supportedLanguages = Object.keys(translations) as Language[];

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined,
);

function getInitialLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);

  return supportedLanguages.includes(storedLanguage as Language)
    ? (storedLanguage as Language)
    : "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      t: (key: TranslationKey, replacements: Replacements = {}) => {
        const languageTranslations = translations[language] as Partial<
          Record<TranslationKey, string>
        >;
        const template = languageTranslations[key] ?? translations.en[key];
        let text = String(template);

        for (const [name, value] of Object.entries(replacements)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }

        return text;
      },
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
