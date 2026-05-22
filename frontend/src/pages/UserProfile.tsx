import "./UserProfile.css";
import { useNavigate } from "react-router-dom";
import { getUser } from "../auth/session";

const UserProfile = () => {
  const navigate = useNavigate();

  const user = getUser();

  return (
    <div className="UserProfile">
      <div className="profile-card">
        {/* HEADER */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.photo ? (
              <img
                src={user.photo}
                alt="Profile"
                className="profile-avatar-image"
              />
            ) : (
              <span className="profile-avatar-letter">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{user?.username || "Unknown User"}</h1>

            <p className="profile-email">{user?.email || "No email"}</p>
          </div>

          <button className="returnButton" onClick={() => navigate("/")}>
            ← Back
          </button>
        </div>

        {/* ABOUT */}
        <div className="profile-block">
          <div className="profile-section">
            <h2>About</h2>
          </div>

          <div className="profile-sub-section">
            <div className="about-container">
              <div className="about-text">
                {user?.bio || "This user has no bio yet."}
              </div>

              <div className="about-stats">
                <div className="stat-card">
                  <h3>Followers</h3>
                  <p>{user?.followers || 0}</p>
                </div>

                <div className="stat-card">
                  <h3>Following</h3>
                  <p>{user?.following || 0}</p>
                </div>

                <div className="stat-card">
                  <h3>Playlists</h3>
                  <p>{user?.playlists?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PLAYLISTS */}
        <div className="profile-block">
          <div className="profile-section">
            <h2>Playlists</h2>
          </div>

          <div className="profile-sub-section">
            <div className="playlist-grid">
              {user?.playlists?.length ? (
                user.playlists.map((playlist: any, index: number) => (
                  <div className="playlist-card" key={index}>
                    <div className="playlist-cover"></div>

                    <div className="playlist-info">
                      <h3>{playlist.name}</h3>
                      <p>{playlist.songs?.length || 0} songs</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No playlists yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* FAVORITE ARTISTS */}
        <div className="profile-block">
          <div className="profile-section">
            <h2>Favorite Artists</h2>
          </div>

          <div className="profile-sub-section">
            <div className="artists-grid">
              {user?.favoriteArtists?.length ? (
                user.favoriteArtists.map((artist: any, index: number) => (
                  <div className="artist-card" key={index}>
                    <img
                      src={artist.image || "https://via.placeholder.com/80"}
                      alt={artist.name}
                      className="artist-image"
                    />

                    <div className="artist-info">
                      <h3>{artist.name}</h3>
                      <p>{artist.genre || "Unknown genre"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No favorite artists yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* FAVORITE ALBUMS */}
        <div className="profile-block">
          <div className="profile-section">
            <h2>Favorite Albums</h2>
          </div>

          <div className="profile-sub-section">
            <div className="albums-grid">
              {user?.favoriteAlbums?.length ? (
                user.favoriteAlbums.map((album: any, index: number) => (
                  <div className="album-card" key={index}>
                    <div className="album-cover"></div>

                    <div className="album-info">
                      <h3>{album.name}</h3>
                      <p>{album.artist}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No favorite albums yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* FRIENDS */}
        <div className="profile-block">
          <div className="profile-section">
            <h2>Friends</h2>
          </div>

          <div className="profile-sub-section">
            <div className="friends-list">
              {user?.friends?.length ? (
                user.friends.map((friend: any, index: number) => (
                  <div className="friend-card" key={index}>
                    <img
                      src={friend.photo || "https://via.placeholder.com/60"}
                      alt={friend.username}
                      className="friend-avatar"
                    />

                    <div className="friend-info">
                      <h3>{friend.username}</h3>
                      <p>{friend.status || "Offline"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No friends added yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="profile-actions">
          <button className="edit-button">Edit Profile</button>

          <button className="logout-button">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
