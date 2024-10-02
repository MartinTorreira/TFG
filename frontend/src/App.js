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

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    //d4c9c9
    //bg-[#f0fffe]
  };

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} className="z-20" />
      <Toaster richColors position="bottom-center" />
      <div class="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#f4f4f5_40%,#61c5c1_130%)]"></div>{" "}
      <div className="fixed inset-0 z-0 h-full w-full bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-rose-100 to-teal-100">
        {" "}
        <div className="relative z-10 mb-10">
          <Navbar />
          <Routes>
            <Route path="/users/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Home />} />
            <Route path="/users/signUp" element={<Register />} />
            <Route path="/users/profile" element={<ProfileSettings />} />
            <Route path="/users/stats" element={<Stats />} />
            <Route path="/product/add" element={<AddProduct />} />
            <Route
              path="/product/:id/details"
              element={<ProductDetails />}
            />{" "}
            {/* Ruta con parámetro de ID */}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
