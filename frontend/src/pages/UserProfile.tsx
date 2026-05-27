import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { clearUser, getUser, saveUser } from "../auth/session";
import { useLanguage } from "../i18n/LanguageContext";
import { updateAvatar } from "../api/auth";
import { useRef, useState } from "react";
import { ApiError } from "../api/http";
import { usePlayback } from "../playback/PlaybackContext";
import Images from "../../images/TemplateImages.png";

const UserProfile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const user = getUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "favorites" | "recent" | "playlists"
  >("overview");

  const playback = usePlayback();
  const favorites = playback?.favorites ?? [];
  const recentlyPlayed = playback?.recentlyPlayed ?? [];
  const playTrack = playback?.playTrack;
  const removeFavorite = playback?.removeFavorite;

  async function handleAvatarFile(file: File) {
    setAvatarError(null);

    if (!user?._id) {
      setAvatarError(t("profile.avatar.signInFirst"));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError(t("profile.avatar.invalidFileType"));
      return;
    }

    const maxBytes = 1_500_000;
    if (file.size > maxBytes) {
      setAvatarError(t("profile.avatar.tooLarge"));
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error(t("profile.avatar.readFailed")));
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.readAsDataURL(file);
    });

    if (!dataUrl) {
      setAvatarError(t("profile.avatar.readFailed"));
      return;
    }

    setAvatarUploading(true);
    try {
      const nextUser = await updateAvatar({
        userId: user._id,
        avatar: dataUrl,
      });
      saveUser(nextUser);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setAvatarError(
          t("profile.avatar.uploadFailedStatus", { status: err.status }),
        );
      } else {
        setAvatarError(t("profile.avatar.uploadFailed"));
      }
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleRemoveAvatar() {
    setAvatarError(null);
    if (!user?._id) {
      setAvatarError(t("profile.avatar.signInFirst"));
      return;
    }

    setAvatarUploading(true);
    try {
      const nextUser = await updateAvatar({ userId: user._id, avatar: null });
      saveUser(nextUser);
    } catch {
      setAvatarError(t("profile.avatar.removeFailed"));
    } finally {
      setAvatarUploading(false);
    }
  }

  const topArtists = (() => {
    const map = new Map<
      number,
      { id: number; name: string; picture?: string; plays: number }
    >();
    for (const item of recentlyPlayed) {
      const a = item.track.artist;
      if (!a) continue;
      const prev = map.get(a.id);
      if (prev) prev.plays += 1;
      else
        map.set(a.id, { id: a.id, name: a.name, picture: a.picture, plays: 1 });
    }
    return Array.from(map.values())
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 6);
  })();

  return (
    <div className="UserProfile">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                alt={t("sidePanel.profile")}
                className="profile-avatar-image"
                src={user.avatar}
              />
            ) : (
              <span className="profile-avatar-letter">
                {(user?.username ?? user?.email ?? t("common.guest"))
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {user?.username ?? t("common.guest")}
            </h1>
            <p className="profile-email">
              {user?.email ?? t("common.notSignedIn")}
            </p>
          </div>

          <button className="returnButton" onClick={() => navigate("/")}>
            {t("common.back")}
          </button>
        </div>

        {user ? (
          <div className="profile-avatar-actions">
            <input
              ref={fileInputRef}
              className="profile-avatar-input"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                void handleAvatarFile(file);
                event.target.value = "";
              }}
              disabled={avatarUploading}
            />

            <button
              className="profile-avatar-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
            >
              {avatarUploading
                ? t("profile.avatar.uploading")
                : t("profile.avatar.change")}
            </button>

            {user.avatar ? (
              <button
                className="profile-avatar-button profile-avatar-button-secondary"
                type="button"
                onClick={() => void handleRemoveAvatar()}
                disabled={avatarUploading}
              >
                {t("profile.avatar.remove")}
              </button>
            ) : null}

            {avatarError ? (
              <p className="profile-avatar-error">{avatarError}</p>
            ) : null}
          </div>
        ) : null}

        <nav className="profile-tabs" aria-label={t("profile.tabs.aria")}>
          <button
            type="button"
            className={`profile-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            {t("profile.tabs.overview")}
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            {t("profile.tabs.favorites", { count: favorites.length })}
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === "recent" ? "active" : ""}`}
            onClick={() => setActiveTab("recent")}
          >
            {t("profile.tabs.recent", { count: recentlyPlayed.length })}
          </button>
          <button
            type="button"
            className={`profile-tab ${activeTab === "playlists" ? "active" : ""}`}
            onClick={() => setActiveTab("playlists")}
          >
            {t("profile.tabs.playlists")}
          </button>
        </nav>

        {activeTab === "overview" ? (
          <div className="profile-block">
            <div className="profile-section">
              <h2>{t("profile.overview.title")}</h2>
            </div>
            <div className="profile-sub-section">
              <div className="profile-stats">
                <div className="stat-card">
                  <h3>{t("profile.overview.favorites")}</h3>
                  <p>{favorites.length}</p>
                </div>
                <div className="stat-card">
                  <h3>{t("profile.overview.recent")}</h3>
                  <p>{recentlyPlayed.length}</p>
                </div>
                <div className="stat-card">
                  <h3>{t("profile.overview.topArtist")}</h3>
                  <p>{topArtists[0]?.name ?? "—"}</p>
                </div>
              </div>

              <div className="profile-split">
                <div className="profile-panel">
                  <h3 className="profile-panel-title">
                    {t("profile.overview.topArtists")}
                  </h3>
                  {topArtists.length === 0 ? (
                    <p className="profile-muted">
                      {t("profile.overview.noStats")}
                    </p>
                  ) : (
                    <div className="profile-chip-grid">
                      {topArtists.map((a) => (
                        <div
                          className="profile-chip"
                          key={a.id}
                          title={t("rightPanel.plays", { count: a.plays })}
                        >
                          <img
                            className="profile-chip-img"
                            src={a.picture ?? Images}
                            alt={a.name}
                          />
                          <div className="profile-chip-text">
                            <span className="profile-chip-title">{a.name}</span>
                            <span className="profile-chip-sub">
                              {t("rightPanel.plays", { count: a.plays })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="profile-panel">
                  <h3 className="profile-panel-title">
                    {t("profile.overview.tipsTitle")}
                  </h3>
                  <ul className="profile-bullets">
                    <li>{t("profile.overview.tip1")}</li>
                    <li>{t("profile.overview.tip2")}</li>
                    <li>{t("profile.overview.tip3")}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "favorites" ? (
          <div className="profile-block">
            <div className="profile-section">
              <h2>{t("profile.favorites.title")}</h2>
            </div>
            <div className="profile-sub-section">
              {favorites.length === 0 ? (
                <p className="profile-muted">
                  {t("profile.favorites.empty")}
                </p>
              ) : (
                <div className="profile-list">
                  {favorites.slice(0, 20).map((track) => (
                    <div className="profile-list-item" key={track.id}>
                      <img
                        className="profile-list-img"
                        src={
                          track.album?.cover ?? track.artist?.picture ?? Images
                        }
                        alt={track.title}
                      />
                      <div className="profile-list-body">
                        <div className="profile-list-title">{track.title}</div>
                        <div className="profile-list-sub">
                          {track.artist?.name ?? t("common.unknownArtist")}
                        </div>
                      </div>
                      <div className="profile-list-actions">
                        <button
                          type="button"
                          className="profile-action-button"
                          onClick={() => playTrack?.(track)}
                          disabled={!track.preview}
                        >
                          {t("common.play")}
                        </button>
                        <button
                          type="button"
                          className="profile-action-button profile-action-secondary"
                          onClick={() => removeFavorite?.(track.id)}
                        >
                          {t("profile.favorites.remove")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "recent" ? (
          <div className="profile-block">
            <div className="profile-section">
              <h2>{t("profile.recent.title")}</h2>
            </div>
            <div className="profile-sub-section">
              {recentlyPlayed.length === 0 ? (
                <p className="profile-muted">
                  {t("profile.recent.empty")}
                </p>
              ) : (
                <div className="profile-list">
                  {recentlyPlayed.map((item) => (
                    <div
                      className="profile-list-item"
                      key={`${item.track.id}-${item.playedAt}`}
                    >
                      <img
                        className="profile-list-img"
                        src={
                          item.track.album?.cover ??
                          item.track.artist?.picture ??
                          Images
                        }
                        alt={item.track.title}
                      />
                      <div className="profile-list-body">
                        <div className="profile-list-title">
                          {item.track.title}
                        </div>
                        <div className="profile-list-sub">
                          {item.track.artist?.name ?? t("common.unknownArtist")}
                        </div>
                      </div>
                      <div className="profile-list-actions">
                        <span className="profile-time">
                          {new Date(item.playedAt).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          className="profile-action-button"
                          onClick={() => playTrack?.(item.track)}
                          disabled={!item.track.preview}
                        >
                          {t("common.play")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "playlists" ? (
          <div className="profile-block">
            <div className="profile-section">
              <h2>{t("profile.playlists.title")}</h2>
            </div>
            <div className="profile-sub-section">
              <p className="profile-muted">
                {t("profile.playlists.comingSoon")}
              </p>
              <div className="profile-placeholder-grid">
                {[
                  t("profile.playlists.sample1"),
                  t("profile.playlists.sample2"),
                  t("profile.playlists.sample3"),
                  t("profile.playlists.sample4"),
                ].map((name) => (
                  <div className="profile-placeholder" key={name}>
                    <h3>{name}</h3>
                    <p>{t("profile.playlists.sampleDesc")}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

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
            <button
              className="logout-button"
              onClick={() => navigate("/signin")}
            >
              {t("auth.signIn")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
