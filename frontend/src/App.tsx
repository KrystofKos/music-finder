import "./App.css";
import SignIn from "./components/authorization/SignIn";
import SignUp from "./components/authorization/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SidePanel from "./components/SidePanel/SidePanel";
import Header from "./components/Header/Header";
import SearchBar from "./components/SearchBar/SearchBar";

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Header />
        <SidePanel />
        <main className="Main">
          <SearchBar />
        </main>
        <Routes>
          <Route path="signup" element={<SignUp />} />
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
