import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { clearUser, getUser } from "../auth/session";

const UserProfile = () => {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="UserProfile">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src="https://via.placeholder.com/120"
            alt="Profile"
            className="profile-avatar"
          />

          <div className="profile-info">
            <h1 className="profile-name">{user?.username ?? "Guest"}</h1>
            <p className="profile-email">{user?.email ?? "Not signed in"}</p>
          </div>

          <button className="returnButton" onClick={() => navigate("/")}>
            ← Back
          </button>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>About</h2>
          </div>
          <div className="profile-sub-section"></div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>Playlists</h2>
          </div>
          <div className="profile-sub-section"></div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>Favorite Artists</h2>
          </div>
          <div className="profile-sub-section"></div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>Favorite Albums</h2>
          </div>
          <div className="profile-sub-section"></div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>Friends</h2>
          </div>
          <div className="profile-sub-section"></div>
        </div>

        <div className="profile-actions">
          <button className="edit-button">Edit Profile</button>
          {user ? (
            <button
              className="logout-button"
              onClick={() => {
                clearUser();
                navigate("/");
              }}
            >
              Logout
            </button>
          ) : (
            <button className="logout-button" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
