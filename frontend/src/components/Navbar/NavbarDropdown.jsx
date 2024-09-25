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
  const { setToken } = useContext(LoginContext);
  const navigate = useNavigate();

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
          <img src={imagePath} className="w-10 h-10 rounded-full" />
        </button>
      </DropdownTrigger>
      
      <DropdownMenu aria-label="Static Actions">

        <DropdownItem key="edit">
          <button onClick={() => handleNavigate("/users/profile")}>Mi perfil
            </button>
        </DropdownItem>
        
        <DropdownItem key="edit">
          <button onClick={() => handleNavigate("/users/stats")}>Estadísticas</button>
        </DropdownItem>

        <DropdownItem key="delete" className="text-danger" color="danger">
          <button onClick={handleLogout}>Cerrar sesión</button>
        </DropdownItem>

      </DropdownMenu>
    </Dropdown>
  );
};
