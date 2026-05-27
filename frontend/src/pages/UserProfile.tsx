import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { clearUser, getUser } from "../auth/session";
import { useLanguage } from "../i18n/LanguageContext";

const UserProfile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const user = getUser();

  return (
    <div className="UserProfile">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.username ? (
              <img alt={t("sidePanel.profile")} className="profile-avatar-image" />
            ) : (
              <span className="profile-avatar-letter">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user?.username ?? t("common.guest")}</h1>
            <p className="profile-email">
              {user?.email ?? t("common.notSignedIn")}
            </p>
          </div>

          <button className="returnButton" onClick={() => navigate("/")}>
            {t("common.back")}
          </button>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>{t("profile.about")}</h2>
          </div>

          <div className="profile-sub-section">
            <div className="about-container">
              <div className="about-text"></div>

              <div className="about-stats">
                <div className="stat-card">
                  <h3>{t("profile.followers")}</h3>
                </div>

                <div className="stat-card">
                  <h3>{t("profile.following")}</h3>
                </div>

                <div className="stat-card">
                  <h3>{t("profile.playlists")}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>{t("profile.playlists")}</h2>
          </div>

          <div className="profile-sub-section">
            <div className="playlist-grid"></div>
          </div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>{t("profile.favoriteArtists")}</h2>
          </div>

          <div className="profile-sub-section">
            <div className="artists-grid"></div>
          </div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>{t("profile.favoriteAlbums")}</h2>
          </div>

          <div className="profile-sub-section">
            <div className="albums-grid"></div>
          </div>
        </div>

        <div className="profile-block">
          <div className="profile-section">
            <h2>{t("profile.friends")}</h2>
          </div>

          <div className="profile-sub-section">
            <div className="friends-list"></div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="edit-button">{t("profile.edit")}</button>

          {user ? (
            <button
              className="logout-button"
              onClick={() => {
                clearUser();
                navigate("/");
              }}
            >
              {t("profile.logout")}
            </button>
          ) : (
            <button className="logout-button" onClick={() => navigate("/signin")}>
              {t("auth.signIn")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
