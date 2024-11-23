import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

import React, { useContext } from "react";
import { config } from "../../config/constants";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";

export const NavbarDropdown = ({ imagePath }) => {
  const { user, setToken } = useContext(LoginContext);
  const navigate = useNavigate();
  const id = user?.id;

  const handleLogout = (e) => {
    e.preventDefault();
    setToken(null);
    localStorage.removeItem("avatar");
    localStorage.removeItem(config.SERVICE_TOKEN_NAME);
    navigate("/home");
  };

  const handleNavigate = (path) => {
    //e.preventDefault();
    navigate(path);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <button variant="bordered">
          <img
            src={imagePath}
            className="w-10 h-10 rounded-full border border-gray-300"
            alt="Profile avatar"
          />
        </button>
      </DropdownTrigger>

      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="stats">
          <button onClick={() => handleNavigate(`/users/userProfile/${id}`)}>
            Mis datos
          </button>
        </DropdownItem>

        <DropdownItem key="profile">
          <button onClick={() => handleNavigate("/users/profile")}>
            Editar perfil
          </button>
        </DropdownItem>

        <DropdownItem key="delete" className="text-danger" color="danger">
          <button onClick={handleLogout}>Cerrar sesión</button>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
