import React from "react";
import { useNavigate } from "react-router-dom";
import useFavoriteStore from "../store/useFavoriteStore";
import { removeFromFavorites } from "../../backend/productService";
import { toast } from "sonner";

export const FavoriteRow = ({ item }) => {
  const { userDto, productDto, favoritedAt } = item;
  const navigate = useNavigate();
  const { removeFavorite } = useFavoriteStore();

  const handleNavigate = () => {
    console.log("aa");
    navigate(`../product/${productDto.id}/details`);
  };

  const onSuccess = () => {
    removeFavorite(productDto.id);
  };

  const onErrors = () => {
    toast.error("Error al quitar el producto de favoritos");
  };

  const handleRemoveFromFavorites = () => {
    removeFromFavorites(productDto.id, onSuccess, onErrors);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 hover:bg-gray-50 transition-all">
      <div className="grid grid-cols-6 gap-4 items-center">
        <div className="flex items-center col-span-1 text-center">
          <img
            className="w-16 h-16 rounded-lg mr-4"
            src={productDto.images[0] || "https://via.placeholder.com/64"}
            alt={productDto.name}
          />
          <span className="font-semibold text-gray-800 dark:text-white">
            {productDto.name}
          </span>
        </div>
        <p className="font-semibold text-gray-800 col-span-1 text-center">
          {productDto.categoryDto.name}
        </p>
        <p className="font-semibold text-gray-800 col-span-1 text-center">
          {userDto.userName}
        </p>
        <p className="font-semibold text-gray-800  col-span-1 text-center">
          {new Date(favoritedAt).toLocaleDateString()}
        </p>
        <p className="font-bold text-gray-900 dark:text-white col-span-1 text-center">
          {productDto.price.toFixed(2)} €
        </p>
        <div className="flex justify-center text-center items-center space-x-6">
          <button
            className="font-medium text-gray-800 dark:text-blue-500 hover:underline col-span-1 text-center"
            onClick={() => {
              handleNavigate();
            }}
          >
            Detalles
          </button>
          <button
            className="font-medium text-red-400 hover:underline col-span-1 text-center"
            onClick={() => {
              handleRemoveFromFavorites();
            }}
          >
            Quitar
          </button>
        </div>
      </div>
    </div>
  );
};
