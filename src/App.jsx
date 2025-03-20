import { Route, Routes } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import "./index.scss";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* main home page */}
        <Route path="/" element={<Home />} />
        {/* profile page */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
