import PlayBack from "./components/PlayBack/PlayBack";
import RightSidePanel from "./components/RightSidePanel/RightSidePanel";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import SidePanel from "./components/SidePanel/SidePanel";
import Dashboard from "./pages/Dashboard";
import Favorite from "./pages/Favorite";
import LiveChat from "./pages/LiveChat";
import MobileApp from "./pages/MobileApp";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import { PlaybackProvider } from "./playback/PlaybackContext";
import Playlist from "./pages/Playlist";
import TopMusic from "./pages/TopMusic";
import { ThemeProvider } from "./theme/ThemeContext";
import { LanguageProvider } from "./i18n/LanguageContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <PlaybackProvider>
            <div className="wrapper">
              <PlayBack />
              <SidePanel />
              <main className="Main">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/favorite" element={<Favorite />} />
                  <Route path="/livechat" element={<LiveChat />} />
                  <Route path="/mobileapp" element={<MobileApp />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/playlist/:id" element={<Playlist />} />
                  <Route path="/topmusic" element={<TopMusic />} />
                </Routes>
              </main>
              <RightSidePanel />
            </div>
          </PlaybackProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
