import React, { useContext } from "react";
import { NotificationOff } from "../../icons/NotificationOff";
import { NotificationOn } from "../../icons/NotificationOn";
import { LoginContext } from "../context/LoginContext";
import { NavbarDropdown } from "./NavbarDropdown";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "sonner";

const Navbar = ({ notification }) => {
  const { user, token } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleNavigateAddProduct = () => {
    if (token !== null) {
      navigate("product/add");
    } else {
      toast.error("Debes iniciar sesión para acceder a esta página");
      navigate("/users/login");
    }
  };

  return (
    <nav className="backdrop-blur-3xl shadow-sm sticky top-0 z-50 bg-gray-100">
      <div className="container mx-auto flex justify-between items-center p-2">
        {/* Left */}
        <div className="flex items-center font-semibold">
          <button
            onClick={() => navigate("./home")}
            className="ml-2 text-xl font-bold text-gray-900"
          >
            TFG
          </button>
          <div className="hidden md:flex space-x-2 ml-12">
            <NavLink
              to="/users/my-purchases"
              className={({ isActive }) =>
                isActive
                  ? "text-accent-dark text-sm font-semibold p-1 px-3 transition-all uppercase"
                  : "text-black text-sm hover:text-accent-dark font-semibold p-1 px-3  transition-all uppercase"
              }
            >
              Mis compras
            </NavLink>
            <NavLink
              to="/shoppingCart"
              className={({ isActive }) =>
                isActive
                  ? "text-accent-dark text-sm font-semibold p-1 px-3  transition-all uppercase"
                  : "text-black text-sm hover:text-accent-dark font-semibold p-1 px-3 transition-all uppercase"
              }
            >
              Mi carro
            </NavLink>
            <NavLink
              to="/product/favorites"
              className={({ isActive }) =>
                isActive
                  ? "text-accent-dark text-sm font-semibold p-1 px-3 decoration-2 transition-all uppercase"
                  : "text-black text-sm hover:text-accent-dark font-semibold p-1 px-3 transition-all uppercase"
              }
            >
              Favoritos
            </NavLink>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-x-3 font-semibold">
          <button className="mr-3">
            {notification ? <NotificationOn /> : <NotificationOff />}
          </button>
          <button
            className="bg-accent-dark border border-accent hover:opacity-70 text-white p-2 rounded-full px-3 transition-all"
            onClick={() => handleNavigateAddProduct()}
          >
            Vender
          </button>

          {/* User Avatar */}
          {token != null ? (
            <NavbarDropdown imagePath={user.avatar} />
          ) : (
            <a
              className="border border-gray-800 p-2 rounded-full hover:opacity-70 hover:text-accent-darker hover:border-accent-darker transition-all"
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
