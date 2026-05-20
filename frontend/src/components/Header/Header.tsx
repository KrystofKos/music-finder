import { Link } from "react-router-dom";
import "./Header.css";
export default function Header() {
  return (
    <div className="Header">
      <div className="header-left"></div>

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
