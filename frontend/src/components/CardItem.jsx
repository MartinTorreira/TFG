import React from "react";
import { Avatar } from "./Avatar.jsx";
import { CartIcon } from "../icons/CartIcon.jsx";
import { CartIconFilled } from "../icons/CartIconFilled.jsx";
import { FavoriteIcon } from "../icons/FavoriteIcon.jsx";
import { FavoriteIconFilled } from "../icons/FavoriteIconFilled.jsx";

// favorite and cart are booleans

export const CardItem = ({ path, favorite, cart, name }) => {
  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:scale-105 transition-all group">
      <div className="relative translate-y-20 transform opacity-0 transition-all group-hover:translate-y-16 group-hover:opacity-100 -mt-10 ml-4">
        <Avatar className="opacity-100 transition-opacity" />
      </div>
      <a href="#">
        <img
          className="w-full object-cover rounded-t-lg group-hover:opacity-30"
          src={path}
          alt="product image"
        />
      </a>
      <div className="px-5 pb-5 mt-4">
        <a href="#">
          <h5 className="mt-2 font-bold text-gray-600 font-smemibold tracking-tight dark:text-white">
            {name}
          </h5>
        </a>
        <div className="flex items-center justify-between gap-x-2 mt-4">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            599€
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

//https://images.unsplash.com/photo-1603871165848-0aa92c869fa1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=772&q=80
