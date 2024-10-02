import React from "react";
import { Avatar } from "../Avatar.jsx";
import { CartIcon } from "../../icons/CartIcon.jsx";
import { CartIconFilled } from "../../icons/CartIconFilled.jsx";
import { FavoriteIcon } from "../../icons/FavoriteIcon.jsx";
import { FavoriteIconFilled } from "../../icons/FavoriteIconFilled.jsx";
import { Badge } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const CardItem = ({ product, favorite, cart }) => {
  const navigate = useNavigate();

  const handleImageClick = () => {
    // Navega a la página de detalles del producto
    navigate(`/product/${product.id}/details`);
  };

  return (
    <motion.div
      className="relative w-full max-w-sm bg-gray-100 rounded-xl shadow transition-all group"
      onClick={handleImageClick} // Maneja el clic en el CardItem
    >
      <div className="absolute top-1 right-2 z-10">
        <Badge variant="surface" color="gray" className="rounded">
          {product.categoryDto.name}
        </Badge>
      </div>
      <div className="relative translate-y-20 transform opacity-0 transition-all group-hover:translate-y-16 group-hover:opacity-100 -mt-10 ml-4 z-20">
        <Avatar
          className="opacity-100 transition-opacity"
          userName={product.userDto.userName}
          imagePath={product.userDto.avatar}
        />
      </div>
      <div className="relative w-full h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/70 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 pointer-events-none"></div>
        <img
          className="w-full h-full object-cover transition-opacity duration-500 ease-in-out cursor-pointer rounded"
          src={product.images[0]}
          alt={`${product.name}`}
          onClick={handleImageClick} // También puedes manejar el clic aquí
        />
      </div>

      <div className="px-3 pb-1">
        <h5 className="mt-2 text-gray-800 font-medium tracking-tight">
          {product.name}
        </h5>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">
            {product.price.toFixed(2).replace(".", ",")} €
          </span>
          <div className="flex flex-row gap-x-3 mb-2">
            <button
              title={favorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              className="border border-gray-300/80 p-2 rounded-lg"
            >
              {favorite ? (
                <FavoriteIconFilled size={20} />
              ) : (
                <FavoriteIcon size={20} />
              )}
            </button>
            <button
              title={cart ? "Quitar del carro" : "Añadir al carro"}
              className="border border-gray-300/80 p-2 rounded-lg"
            >
              {cart ? <CartIconFilled size={20} /> : <CartIcon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
