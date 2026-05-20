import { CiBellOn } from "react-icons/ci";
import { VscTriangleRight } from "react-icons/vsc";
import {HiOutlineDotsVertical } from "react-icons/hi";
import Images from "../../../images/TemplateImages.png";
import "./RightSidePanel.css";
export default function RightSidePanel() {
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
          <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Miss You" />
              <div className="artist-info-text">
                <h3>Miss You</h3>
              </div>
            </div>
            <div className="recent-meta">
              <p className="recent-time">5m ago</p>
              <VscTriangleRight className="recent-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Golden Hour" />
              <div className="artist-info-text">
                <h3>Golden Hour</h3>
              </div>
            </div>
            <div className="recent-meta">
              <p className="recent-time">8m ago</p>
              <VscTriangleRight className="recent-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Unholy" />
              <div className="artist-info-text">
                <h3>Unholy</h3>
              </div>
            </div>
            <div className="recent-meta">
              <p className="recent-time">10m ago</p>
              <VscTriangleRight className="recent-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Cuff it" />
              <div className="artist-info-text">
                <h3>Cuff it</h3>
              </div>
            </div>
            <div className="recent-meta">
              <p className="recent-time">40m ago</p>
              <VscTriangleRight className="recent-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="Jingle Bells" />
              <div className="artist-info-text">
                <h3>Jingle Bells</h3>
              </div>
            </div>
            <div className="recent-meta">
              <p className="recent-time">45m ago</p>
              <VscTriangleRight className="recent-icon" />
            </div>
          </div>
        </li>
        <li>
          <div className="artist-info">
            <div className="artist-info-left">
              <img src={Images} alt="All Mine" />
              <div className="artist-info-text">
                <h3>All Mine</h3>
              </div>
            </div>
            <div className="recent-meta">
              <p className="recent-time">49m ago</p>
              <VscTriangleRight className="recent-icon" />
            </div>
          </div>
        </li>
      </ul>
      </div>
    </div>
  );
}
