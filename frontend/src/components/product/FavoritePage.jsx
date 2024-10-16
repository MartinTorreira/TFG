// src/components/FavoritePage.jsx
import { FavoriteList } from "./FavoriteList";
import useFavoriteStore from "../store/useFavoriteStore";
import React, { useContext, useEffect } from "react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";

export const FavoritePage = () => {
  const { favorites, loadFavorites } = useFavoriteStore();
  const { token } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("../users/login");
    } else {
      loadFavorites();
    }
  }, [loadFavorites, token, navigate]);

  return (
    <div className="mt-10 lg:w-4/5 mx-auto items-center">
      <FavoriteList favoriteList={favorites} />
    </div>
  );
};
