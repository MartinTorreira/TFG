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
import PaypalPayment from "./components/payment/PaypalPayment.jsx";
import PaymentError from "./components/payment/PaymentError.jsx";
import PaymentSuccess from "./components/payment/PaymentSuccess.jsx";
import OrderConfirmation from "./components/payment/OrderConfirmation.jsx";
import UserPurchasesPage from "./components/payment/UserPurchasesPage.jsx";
import OrderSummary from "./components/payment/OrderSummary.jsx";
import { useLoadScript } from "@react-google-maps/api";
import ShoppingCart from "./components/payment/ShoppingCart/ShoppingCartPage.jsx";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyC3DouYAkc3zzgNFpRiouHVw2fMChNSnJw",
    libraries: ["places"],
  });

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} className="z-50" />
      <Toaster richColors position="bottom-center" />
      {/* Ajustar aquí */}
      <div className="relative min-h-screen w-full bg-gray-200">
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background: `radial-gradient(circle at 10% 90%, rgba(97, 197, 193, 0.3), transparent 45%),
                         radial-gradient(circle at 70% 60%, rgba(97, 197, 193, 0.3), transparent 45%)`,
          }}
        ></div>

        <div className="relative z-0 min-h-screen w-full">
          <Navbar />
          <div className="relative z-10 mb-10">
            <Routes>
              <Route path="/users/login" element={<Login />} />
              <Route path="/home" element={<Home toggleSidebar={toggleSidebar} />} />
              <Route path="/" element={<Home toggleSidebar={toggleSidebar} />} />
              <Route path="/users/signUp" element={<Register />} />
              <Route path="/users/profile" element={<ProfileSettings />} />
              <Route path="/users/stats" element={<Stats />} />
              <Route path="/users/my-purchases" element={<UserPurchasesPage />} />
              <Route path="/product/add" element={<AddProduct />} />
              <Route path="/product/favorites" element={<FavoritePage />} />
              <Route path="/product/:id/details" element={<ProductDetails />} />
              <Route path="/payment" element={<PaypalPayment />} />
              <Route path="/product/order-summary" element={<OrderSummary />} />
              <Route path="/payment/error" element={<PaymentError />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/shoppingCart" element={<ShoppingCart />} />
              <Route path="/purchase/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route path="/payment/purchaseTicket/:id" element={<OrderSummary />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
