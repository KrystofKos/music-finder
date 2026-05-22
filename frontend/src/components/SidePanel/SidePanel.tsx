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

export default function SidePanel() {
  const [active, setActive] = useState<string>("Profile");
  const handleClick = (name: string) => {
    setActive(name);
  };

  return (
    <div className="Sidepanel">
      <Link to="/">
        <div className="Sidepanel-Header">
          <img src="images/logo.png" alt="Logo" className="Header-logo" />
          <h1 className="Header-title">Music Finder</h1>
        </div>
      </Link>
      <div className="Sidepanel-Scroll">
        <div className="Sidepanel-Menu">
          <h2>Menu</h2>
        </div>

        <div className="Sidepanel-List">
          <Link to="/profile">
            <div
              className={`Sidepanel-List-Item ${active === "Profile" ? "active" : ""}`}
              onClick={() => handleClick("Profile")}
            >
              <VscAccount className="item-icon" />
              <span className="item-text">Profile</span>
            </div>
          </Link>

          <Link to="dashboard">
            <div
              className={`Sidepanel-List-Item ${active === "Dashboard" ? "active" : ""}`}
              onClick={() => handleClick("Dashboard")}
            >
              <RxDashboard className="item-icon" />
              <span className="item-text">Dashboard</span>
            </div>
          </Link>

          <Link to="favorite">
            <div
              className={`Sidepanel-List-Item ${active === "Favorite" ? "active" : ""}`}
              onClick={() => handleClick("Favorite")}
            >
              <RxHeart className="item-icon" />
              <span className="item-text">Favorite</span>
            </div>
          </Link>

          <Link to="livechat">
            <div
              className={`Sidepanel-List-Item ${active === "Live Chat" ? "active" : ""}`}
              onClick={() => handleClick("Live Chat")}
            >
              <IoChatboxEllipsesOutline className="item-icon" />
              <span className="item-text">Live Chat</span>
            </div>
          </Link>

          <Link to="friends">
            <div
              className={`Sidepanel-List-Item ${active === "Friends" ? "active" : ""}`}
              onClick={() => handleClick("Friends")}
            >
              <LiaUserFriendsSolid className="item-icon" />
              <span className="item-text">Friends</span>
            </div>
          </Link>

          <Link to="mobileapp">
            <div
              className={`Sidepanel-List-Item ${active === "Mobile App" ? "active" : ""}`}
              onClick={() => handleClick("Mobile App")}
            >
              <CiMobile2 className="item-icon" />
              <span className="item-text">Mobile App</span>
            </div>
          </Link>
        </div>

        <div className="Sidepanel-Help">
          <h2>Help</h2>
        </div>
        <div className="Sidepanel-List">
          <Link to="/settings">
            <div
              className={`Sidepanel-List-Item ${active === "Settings" ? "active" : ""}`}
              onClick={() => handleClick("Settings")}
            >
              <IoSettingsOutline className="item-icon" />
              <span className="item-text">Settings</span>
            </div>
          </Link>

          <Link to="/faqs">
            <div
              className={`Sidepanel-List-Item ${active === "FAQs" ? "active" : ""}`}
              onClick={() => handleClick("FAQs")}
            >
              <TfiHeadphoneAlt className="item-icon" />
              <span className="item-text">FAQs</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
