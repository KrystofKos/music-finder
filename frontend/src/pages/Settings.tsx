import { useState } from "react";
import { FaCheck, FaChevronDown, FaGlobe, FaMoon, FaSun } from "react-icons/fa";
import "./Settings.css";
import { useTheme } from "../theme/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

const languages = [
  { code: "en", labelKey: "settings.english" },
  { code: "cs", labelKey: "settings.czech" },
  { code: "ru", labelKey: "settings.russian" },
] as const;

export default function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const isLightTheme = theme === "light";
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const selectedLanguage =
    languages.find((languageOption) => languageOption.code === language) ??
    languages[0];

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <p className="settings-eyebrow">{t("settings.preferences")}</p>
          <h1>{t("settings.title")}</h1>
        </div>
      </header>

      <section className="settings-panel" aria-labelledby="appearance-title">
        <div className="settings-row">
          <div>
            <h2 id="appearance-title">{t("settings.appearance")}</h2>
            <p>{t("settings.appearanceDescription")}</p>
          </div>

          <button
            className="theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-label={t("settings.switchToTheme", {
              theme: isLightTheme ? t("settings.dark") : t("settings.light"),
            })}
          >
            <span className="theme-toggle-icon" aria-hidden="true">
              {isLightTheme ? <FaSun /> : <FaMoon />}
            </span>
            <span>
              {isLightTheme
                ? t("settings.lightTheme")
                : t("settings.darkTheme")}
            </span>
          </button>
        </div>
      </section>

      <section className="settings-panel" aria-labelledby="language-title">
        <div className="settings-row">
          <div>
            <h2 id="language-title">{t("settings.language")}</h2>
            <p>{t("settings.languageDescription")}</p>
          </div>

          <div className="language-select">
            <button
              className="language-button"
              type="button"
              onClick={() =>
                setIsLanguageMenuOpen((currentValue) => !currentValue)
              }
              aria-expanded={isLanguageMenuOpen}
              aria-haspopup="listbox"
            >
              <span className="language-button-icon" aria-hidden="true">
                <FaGlobe />
              </span>
              <span>{t(selectedLanguage.labelKey)}</span>
              <FaChevronDown className="language-chevron" aria-hidden="true" />
            </button>

            {isLanguageMenuOpen ? (
              <div className="language-menu" role="listbox">
                {languages.map((languageOption) => {
                  const isSelected = languageOption.code === language;

                  return (
                    <button
                      className="language-option"
                      type="button"
                      key={languageOption.code}
                      onClick={() => {
                        setLanguage(languageOption.code as Language);
                        setIsLanguageMenuOpen(false);
                      }}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <span>{t(languageOption.labelKey)}</span>
                      {isSelected ? <FaCheck aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
