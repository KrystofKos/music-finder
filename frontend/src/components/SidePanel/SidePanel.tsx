import "./SidePanel.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const handleClick = (name: string) => {
    setActive(name);
    console.log("Clicked:", name);
  };

  return (
    <div className="Sidepanel">
      <div className="Sidepanel-Header">
        <img src="images/logo.png" alt="Logo" className="Header-logo" />
        <h1 className="Header-title">Music Finder</h1>
      </div>

      <div className="Sidepanel-Scroll">
        <div className="Sidepanel-Menu">
          <h2>Menu</h2>
        </div>

        <div className="Sidepanel-List">
          <div
            className={`Sidepanel-List-Item ${active === "Profile" ? "active" : ""}`}
            onClick={() => {handleClick("Profile"); navigate("/userprofile");}}
          >
            <VscAccount className="item-icon" />
            <span className="item-text">Profile</span>
          </div>

          <div
            className={`Sidepanel-List-Item ${active === "Dashboard" ? "active" : ""}`}
            onClick={() => handleClick("Dashboard")}
          >
            <RxDashboard className="item-icon" />
            <span className="item-text">Dashboard</span>
          </div>

          <div
            className={`Sidepanel-List-Item ${active === "Favorite" ? "active" : ""}`}
            onClick={() => handleClick("Favorite")}
          >
            <RxHeart className="item-icon" />
            <span className="item-text">Favorite</span>
          </div>

          <div
            className={`Sidepanel-List-Item ${active === "Live Chat" ? "active" : ""}`}
            onClick={() => handleClick("Live Chat")}
          >
            <IoChatboxEllipsesOutline className="item-icon" />
            <span className="item-text">Live Chat</span>
          </div>

          <div
            className={`Sidepanel-List-Item ${active === "Friends" ? "active" : ""}`}
            onClick={() => handleClick("Friends")}
          >
            <LiaUserFriendsSolid className="item-icon" />
            <span className="item-text">Friends</span>
          </div>

          <div
            className={`Sidepanel-List-Item ${active === "Mobile App" ? "active" : ""}`}
            onClick={() => handleClick("Mobile App")}
          >
            <CiMobile2 className="item-icon" />
            <span className="item-text">Mobile App</span>
          </div>
        </div>

        <div className="Sidepanel-Help">
          <h2>Help</h2>
        </div>
        <div className="Sidepanel-List">
          <div
            className={`Sidepanel-List-Item ${active === "Settings" ? "active" : ""}`}
            onClick={() => handleClick("Settings")}
          >
            <IoSettingsOutline className="item-icon" />
            <span className="item-text">Settings</span>
          </div>

          <div
            className={`Sidepanel-List-Item ${active === "FAQs" ? "active" : ""}`}
            onClick={() => handleClick("FAQs")}
          >
            <TfiHeadphoneAlt className="item-icon" />
            <span className="item-text">FAQs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
