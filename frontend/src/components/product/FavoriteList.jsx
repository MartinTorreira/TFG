import React from "react";
import { FavoriteRow } from "./FavoriteRow";
import { NotFound } from "../../icons/NotFound";

export const FavoriteList = ({ favoriteList }) => {
  if (!favoriteList || favoriteList.length === 0) {
    return (
      <div className="flex flex-col space-y-10 items-center justify-center w-full py-20">
        <h1 className="text-5xl font-semibold text-gray-400">
          No tienes productos favoritos
        </h1>
        <span>
          <NotFound size={90} />
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Cabecera de la tabla */}
      <div className="bg-accent-ligth p-2 rounded-lg shadow mb-1 items-center">
        <div className="grid grid-cols-6 gap-4 font-semibold text-gray-600 text-center">
          <h3>Producto</h3>
          <h3>Categoría</h3>
          <h3>Usuario</h3>
          <h3>Marcado como favorito</h3>
          <h3>Precio</h3>
          <h3>Acciones</h3>
        </div>
      </div>

      {/* Filas de productos */}
      <div className="flex flex-col">
        {favoriteList.map((item) => (
          <FavoriteRow item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};
