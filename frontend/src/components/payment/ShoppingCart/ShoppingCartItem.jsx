import React, { useContext, useEffect, useState } from "react";
import useFavoriteStore from "../../store/useFavoriteStore";
import useCartStore from "../../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginContext";
import { FavoriteIcon } from "../../../icons/FavoriteIcon";
import { FavoriteIconFilled } from "../../../icons/FavoriteIconFilled";
import {
  getItemByProductId,
  getProductByItemId,
} from "../../../backend/shoppingCartService.js";
import {
  removeFromFavorites,
  addToFavorites,
} from "../../../backend/productService.js";
import { QuantitySelector } from "../../form/QuantitySelector";

const ShoppingCartItem = ({
  product,
  maxQuantity,
  initialQuantity,
  onQuantityChange,
}) => {
  const navigate = useNavigate();
  const { removeFromCart, updateQuantity } = useCartStore();
  const { removeFavorite, addFavorite, isFavorite } = useFavoriteStore();
  const { token, user } = useContext(LoginContext);

  const favorite = isFavorite(product?.id);

  const handleDeleteClick = async (id) => {
    try {
       getItemByProductId(
        id,
        (result) => {
          removeFromCart(result);
        },
        (error) => console.log("Error removing item from cart:", error),
      );
    } catch (error) {
      console.log("Error in handleDeleteClick:", error);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (!token) {
      navigate("../users/login");
    } else {
      const favoriteId = product?.id;

      if (!favorite) {
        addToFavorites(
          favoriteId,
          (newFavorite) => {
            addFavorite(newFavorite);
          },
          (errors) => {
            console.log("Error adding to favorites:", errors);
          },
        );
      } else {
        removeFromFavorites(
          favoriteId,
          () => {
            removeFavorite(favoriteId);
          },
          (errors) => {
            console.log("Error removing from favorites:", errors);
          },
        );
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(Number(product.id), newQuantity);
    onQuantityChange(newQuantity);
  };

  return (

    <p>{product}</p>


    // <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
    //   {console.log("PRODUCTO"+product?.id)}
    //   <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
    //     <span href="#" className="shrink-0 md:order-1">
    //       <img
    //         className="h-20 w-20"
    //         src={product?.images?.length > 0 ? product.images[0] : ""}
    //         alt=""
    //       />
    //     </span>
    //     <label htmlFor={`counter-input-${product?.id}`} className="sr-only">
    //       Choose quantity:
    //     </label>
    //     <div className="flex items-center justify-between md:order-3 md:justify-end">
    //       <QuantitySelector
    //         maxQuantity={maxQuantity}
    //         initialQuantity={initialQuantity}
    //         onQuantityChange={handleQuantityChange}
    //       />
    //       <div className="text-end md:order-4 md:w-32">
    //         <p className="text-base font-bold text-gray-900 dark:text-white">
    //           {product?.price?.toFixed(2).replace(".", ",")}
    //           {" €"}
    //         </p>
    //       </div>
    //     </div>
    //     <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
    //       <span className="text-base font-medium text-gray-900 hover:underline dark:text-white">
    //         {product?.name}
    //       </span>
    //       <div className="flex items-center gap-4 flex-row">
    //         <button
    //           disabled={token !== null ? false : true}
    //           className="rounded-lg"
    //           onClick={(e) => handleFavoriteClick(e)}
    //         >
    //           <span className="transition-all duration-300 ease-in-out flex flex-row items-center space-x-1 text-sm font-medium">
    //             {favorite && token !== null ? (
    //               <>
    //                 <FavoriteIconFilled size={20} />
    //                 <span className="">Quitar de favoritos</span>
    //               </>
    //             ) : (
    //               <>
    //                 <FavoriteIcon size={20} />
    //                 <span className="">Añadir a favoritos</span>
    //               </>
    //             )}
    //           </span>
    //         </button>
    //         <button
    //           onClick={() => handleDeleteClick(product?.id)}
    //           type="button"
    //           className="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
    //         >
    //           <svg
    //             className="me-1.5 h-5 w-5"
    //             aria-hidden="true"
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="24"
    //             height="24"
    //             fill="none"
    //             viewBox="0 0 24 24"
    //           >
    //             <path
    //               stroke="currentColor"
    //               strokeLinecap="round"
    //               strokeLinejoin="round"
    //               strokeWidth="2"
    //               d="M6 18 17.94 6M18 18 6.06 6"
    //             />
    //           </svg>
    //           Quitar
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ShoppingCartItem;