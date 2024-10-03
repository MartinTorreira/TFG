import React, { createContext, useState, useEffect } from "react";
import { config } from "../../config/constants";

export const LoginContext = createContext();

export function LoginProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem(config.SERVICE_TOKEN_NAME);
    if (storedToken) {
      setToken(storedToken);
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) {
      setImage(storedAvatar);
    }
  }, []);

  const updateUserAvatar = (newAvatar) => {
    setUser((prevUser) => {
      const updatedUser = { ...prevUser, avatar: newAvatar };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
    setImage(newAvatar);
    localStorage.setItem("avatar", newAvatar);
  };

  return (
    <LoginContext.Provider
      value={{
        token,
        setToken,
        user,
        setUser,
        image,
        setImage,
        updateUserAvatar,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}