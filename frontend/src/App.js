import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/user/Login.js";
import Register from "./components/user/Register.js";
import ProfileSettings from "./components/user/ProfileSettings.js";
import Stats from "./components/user/Stats.js";
import { Toaster } from "sonner";
import AddProduct from "./components/product/AddProduct";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} className="z-20" />
      <Toaster richColors position="bottom-center" />
      <div class="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]">
        {" "}
        <Navbar />
        <Routes>
          <Route path="/users/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/users/signUp" element={<Register />} />
          <Route path="/users/profile" element={<ProfileSettings />} />
          <Route path="/users/stats" element={<Stats />} />
          <Route path="/product/add" element={<AddProduct />} />
        </Routes>
      </div>

      {/* <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users/signup" element={<Register />} />
          <Route path="/users/profile" element={<Profile />}/> */}
    </BrowserRouter>
  );
}
