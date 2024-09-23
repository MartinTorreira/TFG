import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/user/Login.js";
import Register from "./components/user/Register.js";
import ProfileSettings from "./components/user/ProfileSettings.js";

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
      <div className="relative flex min-h-screen">
        <div className="flex-1 flex flex-col relative">
          <div className="sticky top-0 z-50">
            <Navbar />
          </div>
          <Routes>
            <Route path="/users/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/users/signUp" element={<Register />} />
            <Route path="/users/profile" element={<ProfileSettings />} />
          </Routes>
        </div>
      </div>
      {/* <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/users/signup" element={<Register />} /> 
          <Route path="/users/profile" element={<Profile />}/> */}
    </BrowserRouter>
  );
}
