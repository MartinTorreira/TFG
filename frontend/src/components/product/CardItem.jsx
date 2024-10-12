import React, { useContext, useState } from "react";
import { Avatar } from "../Avatar.jsx";
import { CartIcon } from "../../icons/CartIcon.jsx";
import { CartIconFilled } from "../../icons/CartIconFilled.jsx";
import { FavoriteIcon } from "../../icons/FavoriteIcon.jsx";
import { FavoriteIconFilled } from "../../icons/FavoriteIconFilled.jsx";
import { Badge } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useFavoriteStore from "../store/useFavoriteStore.js";
import { LoginContext } from "../context/LoginContext.js";
import { EditIcon } from "../../icons/EditoIcon.jsx";
import { UpdateProductModal } from "../modals/UpdateProductModal.jsx";
import { DeleteIcon } from "../../icons/DeleteIcon.jsx";
import { deleteProduct } from "../../backend/productService.js";
import { toast } from "sonner";
import { Alert } from "./Alert.jsx";

import {
  removeFromFavorites,
  addToFavorites,
} from "../../backend/productService.js";

export const CardItem = ({ product, cart }) => {
  const navigate = useNavigate();
  const { removeFavorite, addFavorite, isFavorite } = useFavoriteStore();

  const favorite = isFavorite(product.id);
  const { token, user } = useContext(LoginContext);
  const [isAnimating, setIsAnimating] = useState(false); // Estado para controlar la animación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false); // Estado para controlar el modal de confirmación

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsAlertOpen(true); // Mostrar el modal de confirmación
  };

  const handleConfirmDelete = () => {
    deleteProduct(
      product.id,
      () => {
        // Eliminar producto de la lista de favoritos
        removeFavorite(product.id);
      },
      (errors) => {
        console.log(errors);
      },
    );

    toast.success("Producto eliminado correctamente");
    setIsAlertOpen(false); // Cerrar el modal de confirmación
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleImageClick = () => {
    navigate(`/product/${product.id}/details`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsAnimating(true); // Activamos la animación al hacer clic

    if (!token) {
      navigate("../users/login");
    } else {
      const favoriteId = product.id;

      if (!favorite) {
        addToFavorites(
          favoriteId,
          (newFavorite) => {
            addFavorite(newFavorite);
            setIsAnimating(false); // Detenemos la animación una vez se añade a favoritos
          },
          (errors) => {
            console.log(errors);
            setIsAnimating(false); // Detenemos la animación en caso de error
          },
        );
      } else {
        removeFromFavorites(
          favoriteId,
          () => {
            removeFavorite(favoriteId);
            setIsAnimating(false); // Detenemos la animación una vez se elimina de favoritos
          },
          (errors) => {
            console.log(errors);
            setIsAnimating(false); // Detenemos la animación en caso de error
          },
        );
      }
    }
  };

  // Comparar userId del contexto con userDto.id del producto
  const isOwnProduct = product.userDto.id === user.id;

  return (
    <>
      <motion.div
        className={`relative w-full max-w-sm bg-gray-100 rounded-xl shadow transition-all group`}
        onClick={handleImageClick}
      >
        <div className="absolute top-1 right-2 z-10">
          <Badge variant="surface" color="gray" className="rounded">
            {product.categoryDto.name}
          </Badge>
        </div>
        <div className="relative translate-y-20 transform opacity-0 transition-all group-hover:translate-y-16 group-hover:opacity-100 -mt-10 ml-4 z-20">
          <Avatar
            size={"10"}
            className="opacity-100 transition-opacity"
            userName={product.userDto.userName}
            imagePath={product.userDto.avatar}
          />
        </div>
        <div className="relative w-full h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/70 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100 pointer-events-none"></div>
          <img
            className="w-full h-full object-fit transition-opacity duration-500 ease-in-out cursor-pointer rounded"
            src={product.images[0]}
            alt={`${product.name}`}
            onClick={handleImageClick}
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
              {isOwnProduct || token === null ? (
                <>
                  <button
                    onClick={(e) => handleEditClick(e)}
                    title="Este es tu producto"
                    className="border border-gray-300 p-2 rounded-lg hover:opacity-80 transition-all"
                  >
                    <EditIcon size={20} color={"text-gray-800"} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick()}
                    title="Este es tu producto"
                    className="border border-red-100 p-2 bg-transparent rounded-lg hover:opacity-80 transition-all"
                  >
                    <DeleteIcon size={20} color={"text-red-400 "} />
                  </button>
                </>
              ) : (
                <>
                  <motion.button
                    title={
                      favorite ? "Quitar de favoritos" : "Añadir a favoritos"
                    }
                    className="border border-gray-300/80 p-2 rounded-lg"
                    onClick={(e) => handleFavoriteClick(e)}
                    whileTap={{ scale: 1.2 }} // Animación de escalado al hacer clic
                    animate={{ scale: isAnimating ? 1.3 : 1 }} // Animación de rebote
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <span className="hover:scale-125 transition-transform duration-300 ease-in-out">
                      {favorite ? (
                        <FavoriteIconFilled size={20} />
                      ) : (
                        <FavoriteIcon size={20} />
                      )}
                    </span>
                  </motion.button>

                  <button
                    title={cart ? "Quitar del carro" : "Añadir al carro"}
                    className="border border-gray-300/80 p-2 rounded-lg"
                  >
                    {cart ? (
                      <CartIconFilled size={20} />
                    ) : (
                      <CartIcon size={20} />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <UpdateProductModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Alert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
