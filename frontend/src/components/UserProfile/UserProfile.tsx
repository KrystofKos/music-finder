import "./UserProfile.css";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();

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
            <h1 className="profile-name">Username</h1>
            <p className="profile-email">user@email.com</p>
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
          <button className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
