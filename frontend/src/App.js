import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
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
import UserSalesPage from "./components/payment/UserSalesPage.jsx";
import ChatPage from "./components/chat/ChatPage.jsx";
import { RxDoubleArrowDown } from "react-icons/rx";
import { motion } from "framer-motion";

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isChatVisible, setChatVisible] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(
    localStorage.getItem("selectedConversationId") || "default"
  );
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    localStorage.setItem("selectedConversationId", selectedConversationId);
  }, [selectedConversationId]);

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

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
  };

  if (loadError) return <div>Error al cargar Google Maps</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <BrowserRouter>
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} className="z-50" />
      <Toaster richColors position="top-center" />
      <div className="relative min-h-screen w-full bg-gray-200">
        <div
          className="absolute inset-0 h-full w-full"
          style={{
            background: `radial-gradient(circle at 10% 90%, rgba(97, 197, 193, 0.3), transparent 45%),
                         radial-gradient(circle at 70% 60%, rgba(97, 197, 193, 0.3), transparent 45%)`,
          }}
        ></div>

        <div className="relative z-0 min-h-screen w-full">
          <Navbar toggleSidebar={toggleSidebar} />
          <div className="relative z-10 mb-10">
            <Routes>
              <Route
                path="/"
                element={<Home toggleSidebar={toggleSidebar} />}
              />
              <Route
                path="/home"
                element={<Home toggleSidebar={toggleSidebar} />}
              />
              <Route path="/users/login" element={<Login />} />
              <Route path="/users/signUp" element={<Register />} />
              <Route path="/users/profile" element={<ProfileSettings />} />
              <Route path="/users/stats" element={<Stats />} />
              <Route
                path="/users/my-purchases"
                element={<UserPurchasesPage />}
              />
              <Route path="/users/my-sales" element={<UserSalesPage />} />
              <Route path="/product/add" element={<AddProduct />} />
              <Route path="/product/favorites" element={<FavoritePage />} />
              <Route
                path="/product/:id/details"
                element={
                  <ProductDetails
                    setChatVisible={setChatVisible}
                    setSelectedConversationId={setSelectedConversationId}
                  />
                }
              />
              <Route path="/product/order-summary" element={<OrderSummary />} />
              <Route path="/payment" element={<PaypalPayment />} />
              <Route path="/payment/error" element={<PaymentError />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route
                path="/payment/purchaseTicket/:id"
                element={<OrderSummary />}
              />
              <Route
                path="/purchase/order-confirmation/:id"
                element={<OrderConfirmation />}
              />
              <Route path="/shoppingCart" element={<ShoppingCart />} />
              <Route
                path="/users/chat"
                element={
                  <ChatPage
                    setSelectedConversationId={setSelectedConversationId}
                    selectedConversationId={selectedConversationId}
                  />
                }
              />
            </Routes>
          </div>
          {isChatVisible && (
            <div className="fixed z-50 right-20 bottom-12 xl:w-2/5 sm:w-3/4 lg:w-2/3 h-fit bg-white shadow-lg overflow-y-auto rounded-b-2xl ">
              <ChatPage
                setSelectedConversationId={setSelectedConversationId}
                selectedConversationId={selectedConversationId}
                toggleChat={toggleChat}
              />
            </div>
          )}

          <div className="fixed z-50 right-20 bottom-0">
            <motion.button
              onClick={toggleChat}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              className="flex items-center rounded-t-2xl font-medium space-x-4 p-2 pl-4 pr-10 bg-gray-100 text-accent-darker shadow-md hover:bg-gray-50 justify-start"
            >
              <motion.span
                animate={{ rotate: isHover ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <RxDoubleArrowDown />
              </motion.span>
              <p>Mensajes</p>
            </motion.button>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
