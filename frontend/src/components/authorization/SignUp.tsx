import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const close = () => navigate("/");

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
        <form onSubmit={(e) => e.preventDefault()}>
          <h3>E-mail</h3>
          <input type="email" className="authorization_input" />
          <h3>Name</h3>
          <input type="text" className="authorization_input" />
          <h3>Password</h3>
          <input type="password" className="authorization_input" />
          <h3>Repeat password</h3>
          <input type="password" className="authorization_input" />
          <button type="submit" className="authorization_button">
            Sign Up
          </button>
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
