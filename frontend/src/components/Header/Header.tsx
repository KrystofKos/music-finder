import { Link } from "react-router-dom";
import "./Header.css";
import { useLanguage } from "../../i18n/LanguageContext";

export default function Header() {
  const { t } = useLanguage();

  return (
    <div className="Header">
      <div className="header-left"></div>

      <div className="header-right">
        <Link to="/signin">
          <button className="signinButton">{t("auth.signIn")}</button>
        </Link>
        <Link to="/signup">
          <button className="signupButton">{t("auth.signUp")}</button>
        </Link>
      </div>
    </div>
  );
}
