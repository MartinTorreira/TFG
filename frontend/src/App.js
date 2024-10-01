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
  };

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} className="z-20" />
      <Toaster richColors position="bottom-center" />
      {/* <div className="fixed inset-0 z-0 h-full w-full bg-gray-100 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"> */}
      <div className="fixed inset-0 z-0 h-full w-full bg-[#d4c9c9]"> </div>
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
    </BrowserRouter>
  );
}
