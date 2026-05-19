import { Link } from "react-router-dom";
import "./SignIn.css";

export default function SignIn() {
  return (
    <div className="SignIn_overlay">
      <div className="SignIn">
        <h2>Sign In</h2>
        <form action="">
          <h3>Name/e-mail</h3>
          <input type="text" className="authorization_input" />
          <h3>Password</h3>
          <input type="password" className="authorization_input" />
          <button className="authorization_button">Sign In</button>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
