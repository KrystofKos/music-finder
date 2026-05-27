import { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { ApiError } from "../../api/http";
import { saveUser } from "../../auth/session";
import { useLanguage } from "../../i18n/LanguageContext";

export default function SignUp() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const close = () => navigate("/");

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (password !== repeatPassword) {
      setError(t("auth.passwordsNoMatch"));
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await register({ email, username, password });
      saveUser(user);
      close();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API error ${err.status}`);
      } else {
        setError(t("auth.registrationFailed"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="SignUp_overlay" onClick={close} role="presentation">
      <div className="SignUp" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="CloseButton"
          aria-label={t("auth.closeSignUp")}
          onClick={close}
        >
          ×
        </button>
        <h2>{t("auth.signUp")}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <h3>{t("auth.email")}</h3>
          <input
            type="email"
            className="authorization_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <h3>{t("auth.name")}</h3>
          <input
            type="text"
            className="authorization_input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <h3>{t("auth.password")}</h3>
          <input
            type="password"
            className="authorization_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <h3>{t("auth.repeatPassword")}</h3>
          <input
            type="password"
            className="authorization_input"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="submit"
            className="authorization_button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.signingUp") : t("auth.signUp")}
          </button>
          {error ? <p className="authError">{error}</p> : null}
          <p>
            {t("auth.hasAccount")}{" "}
            <Link to="/signin">
              <span>{t("auth.signIn")}</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
