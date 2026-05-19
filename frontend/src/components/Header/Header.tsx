import { Link } from "react-router-dom";
import "./Header.css";
export default function Header() {
  return (
    <div className="Header">
      <div className="header-left">
        <img src="images/logo.png" alt="Logo" className="Header-logo" />
        <h1 className="Header-title">Music Finder</h1>
      </div>

      <div className="header-right">
        <Link to="/signin">
          <button className="signinButton">Sign In</button>
        </Link>
        <Link to="/signup">
          <button className="signupButton">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}
