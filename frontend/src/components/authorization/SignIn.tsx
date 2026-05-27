import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { ApiError } from "../../api/http";
import { saveUser } from "../../auth/session";
import { useLanguage } from "../../i18n/LanguageContext";
import "./SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const close = () => navigate("/");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const user = await login({ email, password });
      saveUser(user);
      close();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API error ${err.status}`);
      } else {
        setError(t("auth.wrongCredentials"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="SignIn_overlay" onClick={close} role="presentation">
      <div className="SignIn" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="CloseButton"
          aria-label={t("auth.closeSignIn")}
          onClick={close}
        >
          ×
        </button>
        <h2>{t("auth.signIn")}</h2>
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
          <h3>{t("auth.password")}</h3>
          <input
            type="password"
            className="authorization_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button
            type="submit"
            className="authorization_button"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.signingIn") : t("auth.signIn")}
          </button>
          {error ? <p className="authError">{error}</p> : null}
          <p>
            {t("auth.noAccount")}{" "}
            <Link to="/signup">
              <span>{t("auth.signUp")}</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
