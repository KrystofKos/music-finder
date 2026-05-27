import { CiBellOn } from "react-icons/ci";
import { VscTriangleRight } from "react-icons/vsc";
import {HiOutlineDotsVertical } from "react-icons/hi";
import Images from "../../../images/TemplateImages.png";
import "./RightSidePanel.css";
import { usePlayback } from "../../playback/PlaybackContext";
import { getUser, onUserChange } from "../../auth/session";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";

function formatAgo(msAgo: number, t: ReturnType<typeof useLanguage>["t"]) {
  const seconds = Math.max(0, Math.floor(msAgo / 1000));
  if (seconds < 60) return t("rightPanel.secondsAgo", { count: seconds });
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t("rightPanel.minutesAgo", { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("rightPanel.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("rightPanel.daysAgo", { count: days });
}

export default function RightSidePanel() {
  const { recentlyPlayed, playTrack } = usePlayback();
  const { t } = useLanguage();
  const [user, setUser] = useState(() => getUser());

  useEffect(() => onUserChange(() => setUser(getUser())), []);

  const topArtists = useMemo(() => {
    const map = new Map<
      number,
      { id: number; name: string; picture?: string; plays: number }
    >();

    for (const item of recentlyPlayed) {
      const a = item.track.artist;
      if (!a) continue;
      const prev = map.get(a.id);
      if (prev) {
        prev.plays += 1;
      } else {
        map.set(a.id, {
          id: a.id,
          name: a.name,
          picture: a.picture,
          plays: 1,
        });
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 5);
  }, [recentlyPlayed]);

  return (
    <div className="right-side-panel">
      <div className="user-header">
        <img
          src={user?.avatar ?? Images}
          alt={user?.username ?? user?.email ?? t("common.guest")}
          className="user-header-img"
        />
        <div className="user-header-text">
          <h2>{user?.username ?? t("common.guest")}</h2>
          <p>{user?.email ?? t("common.notSignedIn")}</p>
        </div>
        <CiBellOn className="user-header-bell" />
      </div>
      <h2>{t("rightPanel.topArtist")}</h2>
      <div className="section-scroll top-artist-scroll">
        <ul>
          {topArtists.length === 0 ? (
            <li>
              <div className="artist-info">
                <div className="artist-info-left">
                  <div className="artist-info-text">
                    <h3>{t("rightPanel.noData")}</h3>
                    <p>{t("rightPanel.playTracksFirst")}</p>
                  </div>
                </div>
              </div>
            </li>
          ) : (
            topArtists.map((a) => (
              <li key={a.id}>
                <div className="artist-info">
                  <div className="artist-info-left">
                    <img src={a.picture ?? Images} alt={a.name} />
                    <div className="artist-info-text">
                      <h3>{a.name}</h3>
                      <p>{t("rightPanel.plays", { count: a.plays })}</p>
                    </div>
                  </div>
                  <div className="artist-info-right">
                    <HiOutlineDotsVertical className="dots-icon" />
                  </div>
                </div>
              </li>
            ))
          )}
      </ul>
      </div>
      <h2>{t("rightPanel.recentlyPlayed")}</h2>
      <div className="section-scroll recent-played-scroll">
        <ul className="recent-list">
          {recentlyPlayed.length === 0 ? (
            <li>
              <div className="artist-info">
                <div className="artist-info-left">
                  <div className="artist-info-text">
                    <h3>{t("rightPanel.nothingYet")}</h3>
                    <p>{t("rightPanel.playHistory")}</p>
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
                      <p>{item.track.artist?.name ?? t("common.unknownArtist")}</p>
                    </div>
                  </div>
                  <div className="recent-meta">
                    <p className="recent-time">
                      {formatAgo(Date.now() - item.playedAt, t)}
                    </p>
                    <button
                      type="button"
                      className="recent-play"
                      onClick={() => playTrack(item.track)}
                      aria-label={t("common.play")}
                      title={t("common.play")}
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
