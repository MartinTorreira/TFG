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
import ProductDetails from "./components/product/ProductDetails";
import { FavoritePage } from "./components/product/FavoritePage";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} className="z-50" />
      <Toaster richColors position="bottom-center" />
      <div className="absolute inset-0 -z-10 min-h-screen w-full bg-gray-200">
        <div className="relative min-h-screen w-full">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 30% 40%, rgba(97, 197, 193, 0.3), transparent 25%),
                           radial-gradient(circle at 70% 60%, rgba(97, 197, 193, 0.3), transparent 25%)`,
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-0 min-h-screen w-full">
        <Navbar />
        <div className="relative z-10 mb-10">
          <Routes>
            <Route path="/users/login" element={<Login />} />
            <Route
              path="/home"
              element={<Home toggleSidebar={toggleSidebar} />}
            />
            <Route path="/" element={<Home toggleSidebar={toggleSidebar} />} />
            <Route path="/users/signUp" element={<Register />} />
            <Route path="/users/profile" element={<ProfileSettings />} />
            <Route path="/users/stats" element={<Stats />} />
            <Route path="/product/add" element={<AddProduct />} />
            <Route path="/product/favorites" element={<FavoritePage />} />
            <Route path="/product/:id/details" element={<ProductDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
