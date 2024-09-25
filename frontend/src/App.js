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

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} className="z-20" />
      <Toaster richColors position="bottom-center" />
      <div class="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">    <Navbar />
        <Routes>
          <Route path="/users/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/users/signUp" element={<Register />} />
          <Route path="/users/profile" element={<ProfileSettings />} />
          <Route path="/users/stats" element={<Stats />} />
        </Routes>
        </div>
    
      {/* <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users/signup" element={<Register />} /> 
          <Route path="/users/profile" element={<Profile />}/> */}
    </BrowserRouter>
  );
}
