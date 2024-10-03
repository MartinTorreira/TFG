import React, { useEffect } from "react";
import { CardItem } from "./CardItem.jsx";
import useFavoriteStore from "../store/useFavoriteStore";

export const CardGrid = ({ productList }) => {
  const { loadFavorites } = useFavoriteStore();

  useEffect(() => {
    const fetchFavorites = async () => {
      await loadFavorites();
    };
    fetchFavorites();
  }, [loadFavorites]);

  return (
    <div className="grid grid-cols-3 gap-12 max-w-screen-lg mx-auto mt-20">
      {productList.map((product, index) => (
        <CardItem key={index} product={product} />
      ))}
    </div>
  );
};
