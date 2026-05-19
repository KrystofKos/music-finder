import "./SignUp.css";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="SignUp_overlay">
      <div className="SignUp">
        <h2>Sign Up</h2>
        <form action="">
          <h3>E-mail</h3>
          <input type="email" className="authorization_input" />
          <h3>Name</h3>
          <input type="text" className="authorization_input" />
          <h3>Password</h3>
          <input type="password" className="authorization_input" />
          <h3>Repeat password</h3>
          <input type="password" className="authorization_input" />
          <button>Sign Up</button>
          <p>
            Already have an account? <Link to="signin">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
