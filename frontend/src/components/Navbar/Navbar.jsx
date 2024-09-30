import React, { useContext } from "react";
import { NotificationOff } from "../../icons/NotificationOff";
import { NotificationOn } from "../../icons/NotificationOn";
import { LoginContext } from "../context/LoginContext";
import { NavbarDropdown } from "./NavbarDropdown";
import { useNavigate } from "react-router-dom";

const Navbar = ({ notification }) => {
  const { user, token } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  function isLogged() {}

  return (
    <nav className="backdrop-blur-3xl shadow-md top-0 sticky z-50 bg-gray-100/60">
      <div className="container mx-auto flex justify-between items-center p-2">
        {/* Left */}
        <div className="flex items-center font-semibold">
          <button
            onClick={() => handleNavigate("./home")}
            className="ml-2 text-xl font-bold text-gray-900"
          >
            Dashboard
          </button>
          <div className="hidden md:flex space-x-8 ml-12">
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-bold hover:underline"
            >
              Team
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 hover:underline"
            >
              Favoritos
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 hover:underline"
            >
              Mi carro
            </a>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-x-3 font-semibold">
          <button className="mr-3">
            {notification ? <NotificationOn /> : <NotificationOff />}
          </button>
          <button
            className="bg-gray-900 border border-gray-800 hover:opacity-70 text-white p-2 py-2 rounded"
            onClick={() => handleNavigate("/product/add")}
          >
            Vender
          </button>

          {/* User Avatar */}
          {token != null ? (
            <NavbarDropdown imagePath={user.avatar} />
          ) : (
            <a
              className="border border-gray-800 p-2 rounded hover:opacity-70"
              href="/users/login"
            >
              Iniciar sesión
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
