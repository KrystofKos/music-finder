import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { saveUser } from "../../auth/session";
import "./SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();
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
    } catch {
      setError("Wrong email or password");
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
          aria-label="Close sign in"
          onClick={close}
        >
          ×
        </button>
        <h2>Sign In</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <h3>E-mail</h3>
          <input
            type="email"
            className="authorization_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <h3>Password</h3>
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
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
          {error ? <p className="authError">{error}</p> : null}
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              <span>Sign Up</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
