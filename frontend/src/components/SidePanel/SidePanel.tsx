import "./SidePanel.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { VscAccount } from "react-icons/vsc";
import { RxDashboard } from "react-icons/rx";
import { RxHeart } from "react-icons/rx";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { LiaUserFriendsSolid } from "react-icons/lia";
import { CiMobile2 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import Logo from "../../../images/logo.png";
import { useLanguage } from "../../i18n/LanguageContext";
export default function SidePanel() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>("Profile");
  const handleClick = (name: string) => {
    setActive(name);
  };

  return (
    <div className="Sidepanel">
      <Link to="/">
        <div className="Sidepanel-Header">
          <img src={Logo} alt="Logo" className="Header-logo" />
          <h1 className="Header-title">{t("common.appName")}</h1>
        </div>
      </Link>
      <div className="Sidepanel-Scroll">
        <div className="Sidepanel-Menu">
          <h2>{t("sidePanel.menu")}</h2>
        </div>

        <div className="Sidepanel-List">
          <Link to="/profile">
            <div
              className={`Sidepanel-List-Item ${active === "Profile" ? "active" : ""}`}
              onClick={() => handleClick("Profile")}
            >
              <VscAccount className="item-icon" />
              <span className="item-text">{t("sidePanel.profile")}</span>
            </div>
          </Link>

          <Link to="dashboard">
            <div
              className={`Sidepanel-List-Item ${active === "Dashboard" ? "active" : ""}`}
              onClick={() => handleClick("Dashboard")}
            >
              <RxDashboard className="item-icon" />
              <span className="item-text">{t("sidePanel.dashboard")}</span>
            </div>
          </Link>

          <Link to="favorite">
            <div
              className={`Sidepanel-List-Item ${active === "Favorite" ? "active" : ""}`}
              onClick={() => handleClick("Favorite")}
            >
              <RxHeart className="item-icon" />
              <span className="item-text">{t("sidePanel.favorite")}</span>
            </div>
          </Link>

          <Link to="livechat">
            <div
              className={`Sidepanel-List-Item ${active === "Live Chat" ? "active" : ""}`}
              onClick={() => handleClick("Live Chat")}
            >
              <IoChatboxEllipsesOutline className="item-icon" />
              <span className="item-text">{t("sidePanel.liveChat")}</span>
            </div>
          </Link>

          <Link to="friends">
            <div
              className={`Sidepanel-List-Item ${active === "Friends" ? "active" : ""}`}
              onClick={() => handleClick("Friends")}
            >
              <LiaUserFriendsSolid className="item-icon" />
              <span className="item-text">{t("sidePanel.friends")}</span>
            </div>
          </Link>

          <Link to="mobileapp">
            <div
              className={`Sidepanel-List-Item ${active === "Mobile App" ? "active" : ""}`}
              onClick={() => handleClick("Mobile App")}
            >
              <CiMobile2 className="item-icon" />
              <span className="item-text">{t("sidePanel.mobileApp")}</span>
            </div>
          </Link>
        </div>

        <div className="Sidepanel-Help">
          <h2>{t("sidePanel.help")}</h2>
        </div>
        <div className="Sidepanel-List">
          <Link to="/settings">
            <div
              className={`Sidepanel-List-Item ${active === "Settings" ? "active" : ""}`}
              onClick={() => handleClick("Settings")}
            >
              <IoSettingsOutline className="item-icon" />
              <span className="item-text">{t("settings.title")}</span>
            </div>
          </Link>

          <Link to="/faqs">
            <div
              className={`Sidepanel-List-Item ${active === "FAQs" ? "active" : ""}`}
              onClick={() => handleClick("FAQs")}
            >
              <TfiHeadphoneAlt className="item-icon" />
              <span className="item-text">{t("sidePanel.faqs")}</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
