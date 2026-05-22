import { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { ApiError } from "../../api/http";
import { saveUser } from "../../auth/session";

export default function SignUp() {
  const navigate = useNavigate();
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
      setError("Passwords do not match");
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
        setError("Registration failed. Try another email.");
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
          aria-label="Close sign up"
          onClick={close}
        >
          ×
        </button>
        <h2>Sign Up</h2>
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
          <h3>Name</h3>
          <input
            type="text"
            className="authorization_input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
          <h3>Password</h3>
          <input
            type="password"
            className="authorization_input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <h3>Repeat password</h3>
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
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
          {error ? <p className="authError">{error}</p> : null}
          <p>
            Already have an account?{" "}
            <Link to="/signin">
              <span>Sign In</span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
