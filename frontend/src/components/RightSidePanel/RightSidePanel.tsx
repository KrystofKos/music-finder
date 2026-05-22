import { CiBellOn } from "react-icons/ci";
import { VscTriangleRight } from "react-icons/vsc";
import {HiOutlineDotsVertical } from "react-icons/hi";
import Images from "../../../images/TemplateImages.png";
import "./RightSidePanel.css";
import { usePlayback } from "../../playback/PlaybackContext";

function formatAgo(msAgo: number) {
  const seconds = Math.max(0, Math.floor(msAgo / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function RightSidePanel() {
  const { recentlyPlayed, playTrack } = usePlayback();
  return (
    <div className="right-side-panel">
      <div className="user-header">
        <img src={Images} alt="Tarisa" className="user-header-img" />
        <div className="user-header-text">
          <h2>Tarisa</h2>
          <p>Premium Blog</p>
        </div>
        <CiBellOn className="user-header-bell" />
      </div>
      <h2>Top Artist</h2>
      <div className="section-scroll top-artist-scroll">
        <ul>
          <li>
            <div className="artist-info">
              <div className="artist-info-left">
                <img src={Images} alt="Jackie Burhan" />
                <div className="artist-info-text">
                  <h3>Jackie Burhan</h3>
                  <p>500 play album</p>
                </div>
              </div>
              <div className="artist-info-right">
                <HiOutlineDotsVertical className="dots-icon" />
              </div>
            </div>
          </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Maria" />
              <div className="artist-info-text">
                <h3>Maria</h3>
                <p>100 play album</p>
              </div>
            </div>
            <div className="artist-info-right">
              <HiOutlineDotsVertical className="dots-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Jim Kho" />
              <div className="artist-info-text">
                <h3>Jim Kho</h3>
                <p>359 play album</p>
              </div>
            </div>
            <div className="artist-info-right">
              <HiOutlineDotsVertical className="dots-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Aurora Sodakh" />
              <div className="artist-info-text">
                <h3>Aurora Sodakh</h3>
                <p>89 play album</p>
              </div>
            </div>
            <div className="artist-info-right">
              <HiOutlineDotsVertical className="dots-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Marsha Mei" />
              <div className="artist-info-text">
                <h3>Marsha Mei</h3>
                <p>550 play album</p>
              </div>
            </div>
            <div className="artist-info-right">
              <HiOutlineDotsVertical className="dots-icon" />
            </div>
          </div>
        </li>
      </ul>
      </div>
      <h2>Recently Played</h2>
      <div className="section-scroll recent-played-scroll">
        <ul className="recent-list">
          {recentlyPlayed.length === 0 ? (
            <li>
              <div className="artist-info">
                <div className="artist-info-left">
                  <div className="artist-info-text">
                    <h3>Nothing yet</h3>
                    <p>Play a track to see history.</p>
                  </div>
                </div>
              </div>
            </li>
          ) : (
            recentlyPlayed.map((item) => (
              <li key={item.track.id}>
                <div className="artist-info">
                  <div className="artist-info-left">
                    <img
                      src={item.track.album?.cover ?? item.track.artist?.picture ?? Images}
                      alt={item.track.title}
                    />
                    <div className="artist-info-text">
                      <h3>{item.track.title}</h3>
                      <p>{item.track.artist?.name ?? "Unknown artist"}</p>
                    </div>
                  </div>
                  <div className="recent-meta">
                    <p className="recent-time">{formatAgo(Date.now() - item.playedAt)}</p>
                    <button
                      type="button"
                      className="recent-play"
                      onClick={() => playTrack(item.track)}
                      aria-label="Play"
                      title="Play"
                    >
                      <VscTriangleRight className="recent-icon" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
      </ul>
      </div>
    </div>
  );
}
