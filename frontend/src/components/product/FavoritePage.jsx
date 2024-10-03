// src/components/FavoritePage.jsx
import { FavoriteList } from "./FavoriteList";
import useFavoriteStore from "../store/useFavoriteStore";
import { getFavourites } from "../../backend/productService";
import React, { useEffect } from "react";

export const FavoritePage = () => {
  const { favorites, loadFavorites } = useFavoriteStore();

  useEffect(() => {
    loadFavorites(); 
  }, [loadFavorites]);

  return (
    <div className="mt-10 lg:w-4/5 mx-auto items-center">
      <FavoriteList favoriteList={favorites} />
    </div>
  );
};
