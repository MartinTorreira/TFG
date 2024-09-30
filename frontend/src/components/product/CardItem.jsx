import React from "react";
import { Avatar } from "../Avatar.jsx";
import { CartIcon } from "../../icons/CartIcon.jsx";
import { CartIconFilled } from "../../icons/CartIconFilled.jsx";
import { FavoriteIcon } from "../../icons/FavoriteIcon.jsx";
import { FavoriteIconFilled } from "../../icons/FavoriteIconFilled.jsx";
import { Badge } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";

export const CardItem = ({ product, favorite, cart }) => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    navigate(`/product/${product.id}/details`);
  };

  return (
    <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow transition-all group">
      <div className="absolute top-1 right-2 z-10">
        <Badge variant="surface" color="blue" className="text-xs rounded-full">
          {product.categoryDto.name}
        </Badge>
      </div>
      <div className="relative translate-y-20 transform opacity-0 transition-all group-hover:translate-y-16 group-hover:opacity-100 -mt-10 ml-4">
        <Avatar
          className="opacity-100 transition-opacity"
          userName={product.userDto.userName}
          imagePath={product.userDto.avatar}
        />
      </div>
      <div className="relative w-full h-64 overflow-hidden">
        {" "}
        {/* Increased height */}
        <img
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out group-hover:opacity-10 cursor-pointer rounded-t-lg"
          src={product.images[0]}
          alt={`${product.name}`}
          onClick={handleImageClick}
        />
      </div>

      <div className="px-5 pb-3 mt-2">
        {" "}
        {/* Reduced padding and margin */}
        <a href="#">
          <h5 className="mt-2 text-gray-700 font-semibold tracking-tight dark:text-white">
            {product.name}
          </h5>
        </a>
        <div className="flex items-center justify-between gap-x-2 mt-2">
          {" "}
          {/* Reduced margin */}
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {product.price.toFixed(2).replace(".", ",")} €
          </span>
          <div className="flex flex-row gap-x-3">
            <button
              title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              className="border-2 border-black/20 p-2 rounded-lg"
            >
              {favorite ? (
                <FavoriteIconFilled size={24} />
              ) : (
                <FavoriteIcon size={24} />
              )}
            </button>
            <button
              title={cart ? "Quitar del carro" : "Añadir al carro"}
              className="border-2 border-black/20 p-2 rounded-lg"
            >
              {cart ? <CartIconFilled size={24} /> : <CartIcon size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
