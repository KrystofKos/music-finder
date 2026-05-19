import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

export default function SignIn() {
  const navigate = useNavigate();
  const close = () => navigate("/");

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
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>Name/e-mail</h3>
          <input type="text" className="authorization_input" />
          <h3>Password</h3>
          <input type="password" className="authorization_input" />
          <button type="submit" className="authorization_button">
            Sign In
          </button>
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
